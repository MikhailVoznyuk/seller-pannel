const OLLAMA_GENERATE_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_CHAT_URL = process.env.OLLAMA_CHAT_URL || OLLAMA_GENERATE_URL.replace(/\/api\/generate$/, '/api/chat');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
const OLLAMA_KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE || '15m';
const OLLAMA_TEMPERATURE = Number(process.env.OLLAMA_TEMPERATURE || 0.3);

function parseJsonBlock<T>(value: string): T {
  const normalized = value
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(normalized) as T;
}

async function parseError(response: Response) {
  const text = await response.text();
  return text || `Ollama request failed with status ${response.status}`;
}

type GenerateParams = {
  system: string;
  prompt: string;
  format?: Record<string, unknown>;
  signal?: AbortSignal;
};

export async function generateJson<T>({ system, prompt, format, signal }: GenerateParams) {
  const response = await fetch(OLLAMA_GENERATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      system,
      prompt,
      stream: false,
      keep_alive: OLLAMA_KEEP_ALIVE,
      options: {
        temperature: OLLAMA_TEMPERATURE,
      },
      ...(format ? { format } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as { response?: string };

  if (!data.response) {
    throw new Error('Ollama returned empty response');
  }

  return parseJsonBlock<T>(data.response);
}

type ChatParams = {
  messages: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
};

export async function generateChatAnswer({ messages, signal }: ChatParams) {
  const response = await fetch(OLLAMA_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      keep_alive: OLLAMA_KEEP_ALIVE,
      options: {
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as {
    message?: {
      content?: string;
    };
  };

  const content = data.message?.content?.trim();

  if (!content) {
    throw new Error('Ollama returned empty chat response');
  }

  return content;
}
