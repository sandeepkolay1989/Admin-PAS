const getToken = () => {
  // Try to get token from environment variable first
  if (typeof window === 'undefined') {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_TOKEN || '';
  }
  // Client-side: try localStorage, then fallback to environment variable
  return localStorage.getItem('token') || process.env.NEXT_PUBLIC_TOKEN || '';
};

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const authFetchJson = async (url: string, options: RequestInit = {}) => {
  const response = await authFetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

