import { request } from '@/shared/api/http';
import type {
  AdItem,
  AdResponse,
  AdsResponse,
  ChatMessage,
  ChatResponse,
  DescriptionSuggestionResponse,
  EditDraft,
  PriceSuggestionResponse,
  UpdateAdResponse,
} from '@/entities/ad/model/types';


function sanitizeParams(params: EditDraft['params']) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  );
}

function toUpdatePayload(payload: EditDraft) {
  return {
    category: payload.category,
    title: payload.title.trim(),
    description: payload.description,
    price: Number(payload.price),
    params: sanitizeParams(payload.params),
  };
}

type FetchAdsParams = {
  q?: string;
  limit: number;
  skip: number;
  needsRevision?: boolean;
  categories?: string;
  sortColumn: 'title' | 'createdAt';
  sortDirection: 'asc' | 'desc';
};

export async function fetchAds(params: FetchAdsParams, signal?: AbortSignal) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  searchParams.set('limit', String(params.limit));
  searchParams.set('skip', String(params.skip));
  if (params.needsRevision) searchParams.set('needsRevision', 'true');
  if (params.categories) searchParams.set('categories', params.categories);
  searchParams.set('sortColumn', params.sortColumn);
  searchParams.set('sortDirection', params.sortDirection);

  return request<AdsResponse>(`/api/items?${searchParams.toString()}`, {
    signal,
  });
}

export async function fetchAd(id: string, signal?: AbortSignal) {
  const response = await request<AdResponse | AdItem>(`/api/items/${id}`, {
    signal,
  });

  if ('item' in response) {
    return response.item;
  }

  if ('items' in response) {
    return response.items[0];
  }

  return response;
}

export async function updateAd(id: string, payload: EditDraft, signal?: AbortSignal) {
  return request<UpdateAdResponse>(`/api/items/${id}`, {
    method: 'PUT',
    body: toUpdatePayload(payload),
    signal,
  });
}

export async function requestDescriptionSuggestion(
  payload: { item: EditDraft },
  signal?: AbortSignal,
) {
  return request<DescriptionSuggestionResponse>('/ai/description', {
    method: 'POST',
    body: payload,
    signal,
  });
}

export async function requestPriceSuggestion(payload: { item: EditDraft }, signal?: AbortSignal) {
  return request<PriceSuggestionResponse>('/ai/price', {
    method: 'POST',
    body: payload,
    signal,
  });
}

export async function requestChatAnswer(
  payload: { item: EditDraft; messages: ChatMessage[]; question: string },
  signal?: AbortSignal,
) {
  return request<ChatResponse>('/ai/chat', {
    method: 'POST',
    body: payload,
    signal,
  });
}
