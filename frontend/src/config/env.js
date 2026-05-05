const trimTrailingSlash = (url) => url?.replace(/\/$/, '');

export const BACKEND_URL = trimTrailingSlash(
  import.meta.env.BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  ''
);

export const SOCKET_URL = trimTrailingSlash(
  import.meta.env.BACKEND_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  'http://localhost:5000'
);
