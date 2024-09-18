
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

interface CustomFetchError extends Error {
  response?: Response;
  status?: number;
}

const customFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const baseUrlApi = apiUrl + url;

  const token = "your-auth-token";

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config: FetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const queryString = new URLSearchParams(options.params).toString();
  const baseUrlApiWithParams = options.params
    ? baseUrlApi + "?" + queryString
    : baseUrlApi;

  try {
    const response = await fetch(baseUrlApiWithParams, config);

    if (!response.ok) {
      const error: CustomFetchError = new Error(response.statusText);
      error.response = response;
      error.status = response.status;
      throw error;
    }

    return (await response.json()) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};

export default customFetch;
