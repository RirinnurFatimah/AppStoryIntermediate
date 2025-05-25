const extractPathnameSegments = (path) => {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
};

const constructRouteFromSegments = (pathSegments) => {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
};

export const getActivePathname = () =>
  location.hash.replace('#', '') || '/';

export const getActiveRoute = () => {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
};

export const parseActivePathname = () => {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
};

export const getRoute = (pathname) => {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
};

export const parsePathname = (pathname) =>
  extractPathnameSegments(pathname);
