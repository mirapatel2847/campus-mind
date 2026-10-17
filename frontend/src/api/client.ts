import { API_URL } from '../lib/env';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private getAuthToken(): string | null {
    try {
      const rawSession = localStorage.getItem('campusmind_session');
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        return parsed?.token || null;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers = {}, body, ...customConfig } = options;

    let url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const token = this.getAuthToken();
    const reqHeaders = new Headers(headers);

    if (token && !reqHeaders.has('Authorization')) {
      reqHeaders.set('Authorization', `Bearer ${token}`);
    }

    const isFormData = body instanceof FormData;
    if (!isFormData && !reqHeaders.has('Content-Type')) {
      reqHeaders.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...customConfig,
      headers: reqHeaders,
      body: isFormData ? body : typeof body === 'object' && body !== null ? JSON.stringify(body) : body,
    };

    const response = await fetch(url, config);

    if (response.status === 204) {
      return {} as T;
    }

    let data: unknown;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'object' && data !== null && 'detail' in data
          ? String((data as { detail: unknown }).detail)
          : response.statusText || 'Request failed';
      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  }

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: body as BodyInit });
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: body as BodyInit });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;
