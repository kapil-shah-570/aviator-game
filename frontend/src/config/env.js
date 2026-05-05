const trimTrailingSlash = (url) => url?.replace(/\/$/, '');

export const BACKEND_URL = trimTrailingSlash(
  import.meta.env.BACKEND_URL || ''
);

export const SOCKET_URL = trimTrailingSlash(
  import.meta.env.BACKEND_URL || 'http://localhost:5000'
);
