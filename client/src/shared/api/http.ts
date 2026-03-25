type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function request<T>(url: string, options?: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Ошибка запроса');
  }

  return response.json() as Promise<T>;
}
