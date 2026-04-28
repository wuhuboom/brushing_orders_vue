export const routeMetaConfig = {
  "/guide": { skipZoneActive: true },
  "/clause": { skipZoneActive: true },
  "/event": { skipZoneActive: true },
  "/cert": { skipZoneActive: true },
  "/faqs": { skipZoneActive: true },
  "/vips": { skipZoneActive: true },
  "/": { skipZoneActive: true },
  "/my": { skipZoneActive: true },
  "/updatePassword": { skipZoneActive: true },
  "/updateTransactionPassword": { skipZoneActive: true },
  "/cardList": { skipZoneActive: true },
  "/tc": { skipZoneActive: true },
  "/account/login": { skipTradeConfig: true },
};

export function getRouteMetaByPath(path) {
  if (!path) return {};
  return routeMetaConfig[path] || {};
}

export function resolveCurrentRoutePath() {
  const { hash, pathname } = window.location;

  if (hash) {
    const hashPath = hash.replace(/^#/, "") || "/";
    return normalizeRoutePath(hashPath);
  }

  return normalizeRoutePath(pathname || "/");
}

export function normalizeRoutePath(path) {
  const cleanPath =
    String(path || "/")
      .split("?")[0]
      .split("#")[0] || "/";
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}

export function shouldSkipCurrentRouteRequest(metaKey) {
  if (!metaKey) return false;
  const currentPath = resolveCurrentRoutePath();
  return getRouteMetaByPath(currentPath)?.[metaKey] === true;
}
