export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const raw = process.env.NEXT_PUBLIC_API_URL;
    return raw.endsWith('/api') ? raw : `${raw.replace(/\/+$/, '')}/api`;
  }

  // When testing in browser on localhost, route to local Express backend on port 5000
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000/api';
  }

  // Production Vercel backend
  return 'https://aperture-eight-eosin.vercel.app/api';
}

export const API_URL = getApiBaseUrl();

export async function fetcher<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Sends HTTPOnly auth cookies (Challenge 1)
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error
      ? `${data.message || 'Request failed'}: ${data.error}`
      : (data.message || `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
}
