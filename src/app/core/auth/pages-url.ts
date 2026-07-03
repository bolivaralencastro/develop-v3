const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getBasePath = () => {
  if (typeof document === 'undefined') {
    return '';
  }

  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const normalized = trimTrailingSlash(baseHref);
  return normalized === '' ? '' : normalized;
};

export const resolveAppUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = getBasePath();
  return `${window.location.origin}${basePath}${normalizedPath}`;
};
