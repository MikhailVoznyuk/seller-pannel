import Fastify, { FastifyRequest } from 'fastify';

import items from 'data/items.json' with { type: 'json' };
import { Item } from 'src/types.ts';
import {
  AiChatInSchema,
  AiDescriptionInSchema,
  AiPriceInSchema,
  ItemsGetInQuerySchema,
  ItemUpdateInSchema,
} from 'src/validation.ts';
import { treeifyError, ZodError } from 'zod';
import { doesItemNeedRevision } from './src/utils.ts';
import {
  generateChatReply,
  generateDescriptionSuggestion,
  generatePriceSuggestion,
} from './src/ai/service.ts';

const ITEMS = items as Item[];

const fastify = Fastify({
  logger: true,
});

await fastify.register((await import('@fastify/middie')).default);

// Искуственная задержка ответов, чтобы можно было протестировать состояния загрузки
fastify.use((request, _, next) => {
  if (request.url?.startsWith('/ai/')) {
    next();
    return;
  }

  new Promise(res => setTimeout(res, 300 + Math.random() * 700)).then(next);
});

// Настройка CORS
fastify.use((request, reply, next) => {
  reply.setHeader('Access-Control-Allow-Origin', '*');
  reply.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  reply.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    reply.statusCode = 204;
    reply.end();
    return;
  }

  next();
});


function createRequestSignal(request: FastifyRequest) {
  const controller = new AbortController();

  const onClose = () => {
    if (request.raw.aborted) {
      controller.abort();
    }
  };

  request.raw.once('close', onClose);

  return {
    signal: controller.signal,
    cleanup: () => {
      request.raw.off('close', onClose);
    },
  };
}

fastify.get('/health', () => ({ success: true }));

interface ItemGetRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.get<ItemGetRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const item = ITEMS.find(item => item.id === itemId);

  if (!item) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  return {
    ...item,
    needsRevision: doesItemNeedRevision(item),
  };
});

interface ItemsGetRequest extends Fastify.RequestGenericInterface {
  Querystring: {
    q?: string;
    limit?: string;
    skip?: string;
    categories?: string;
    needsRevision?: string;
  };
}

fastify.get<ItemsGetRequest>('/items', request => {
  const {
    q,
    limit,
    skip,
    needsRevision,
    categories,
    sortColumn,
    sortDirection,
  } = ItemsGetInQuerySchema.parse(request.query);

  const filteredItems = ITEMS.filter(item => {
    return (
      item.title.toLowerCase().includes(q.toLowerCase()) &&
      (!needsRevision || doesItemNeedRevision(item)) &&
      (!categories?.length ||
        categories.some(category => item.category === category))
    );
  });

  return {
    items: filteredItems
      .toSorted((item1, item2) => {
        let comparisonValue = 0;

        if (!sortDirection) return comparisonValue;

        if (sortColumn === 'title') {
          comparisonValue = item1.title.localeCompare(item2.title);
        } else if (sortColumn === 'createdAt') {
          comparisonValue =
            new Date(item1.createdAt).valueOf() -
            new Date(item2.createdAt).valueOf();
        }

        return (sortDirection === 'desc' ? -1 : 1) * comparisonValue;
      })
      .slice(skip, skip + limit)
      .map(item => ({
        id: item.id,
        category: item.category,
        title: item.title,
        price: item.price,
        createdAt: item.createdAt,
        needsRevision: doesItemNeedRevision(item),
      })),
    total: filteredItems.length,
  };
});

interface ItemUpdateRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.put<ItemUpdateRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const itemIndex = ITEMS.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  try {
    const parsedData = ItemUpdateInSchema.parse({
      category: ITEMS[itemIndex].category,
      ...(request.body as {}),
    });

    ITEMS[itemIndex] = {
      id: ITEMS[itemIndex].id,
      createdAt: ITEMS[itemIndex].createdAt,
      updatedAt: new Date().toISOString(),
      ...parsedData,
    };

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    throw error;
  }
});


interface AiDescriptionRequest extends Fastify.RequestGenericInterface {
  Body: {
    item: unknown;
  };
}

fastify.post<AiDescriptionRequest>('/ai/description', async (request, reply) => {
  const { signal, cleanup } = createRequestSignal(request);

  try {
    const { item } = AiDescriptionInSchema.parse(request.body);
    return await generateDescriptionSuggestion(item, signal);
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    if ((error as Error).name === 'AbortError') {
      reply.status(499).send({ success: false, error: 'Request aborted' });
      return;
    }

    reply.status(502).send({ success: false, error: (error as Error).message || 'AI request failed' });
  } finally {
    cleanup();
  }
});

interface AiPriceRequest extends Fastify.RequestGenericInterface {
  Body: {
    item: unknown;
  };
}

fastify.post<AiPriceRequest>('/ai/price', async (request, reply) => {
  const { signal, cleanup } = createRequestSignal(request);

  try {
    const { item } = AiPriceInSchema.parse(request.body);
    return await generatePriceSuggestion(item, signal);
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    if ((error as Error).name === 'AbortError') {
      reply.status(499).send({ success: false, error: 'Request aborted' });
      return;
    }

    reply.status(502).send({ success: false, error: (error as Error).message || 'AI request failed' });
  } finally {
    cleanup();
  }
});

interface AiChatRequest extends Fastify.RequestGenericInterface {
  Body: {
    item: unknown;
    question: string;
    messages?: unknown[];
  };
}

fastify.post<AiChatRequest>('/ai/chat', async (request, reply) => {
  const { signal, cleanup } = createRequestSignal(request);

  try {
    const { item, question, messages } = AiChatInSchema.parse(request.body);
    return await generateChatReply(item, messages, question, signal);
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    if ((error as Error).name === 'AbortError') {
      reply.status(499).send({ success: false, error: 'Request aborted' });
      return;
    }

    reply.status(502).send({ success: false, error: (error as Error).message || 'AI request failed' });
  } finally {
    cleanup();
  }
});

const port = Number(process.env.PORT ?? process.env.port ?? 8080);
const host = process.env.HOST || '0.0.0.0';

fastify.listen({ port, host }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.debug(`Server is listening on port ${port}`);
});
