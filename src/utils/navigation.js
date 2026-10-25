const resolvedRoute = (router, target) => {
  try {
    return router.resolve(target);
  } catch (_) {
    return null;
  }
};

export const safePush = (router, target) => {
  const destination = resolvedRoute(router, target);
  if (!destination) return Promise.resolve(false);
  if (destination.fullPath === router.currentRoute.value.fullPath) {
    return Promise.resolve(false);
  }
  return router.push(target);
};

export const safeReplace = (router, target) => {
  const destination = resolvedRoute(router, target);
  if (!destination) return Promise.resolve(false);
  if (destination.fullPath === router.currentRoute.value.fullPath) {
    return Promise.resolve(false);
  }
  return router.replace(target);
};

export const safeBack = (router, fallback = "/") => {
  const current = router.currentRoute.value;
  const historyState = window.history.state || {};
  const previous =
    typeof historyState.back === "string" ? historyState.back : "";
  const previousRoute = previous ? resolvedRoute(router, previous) : null;

  if (
    previousRoute &&
    previousRoute.fullPath !== current.fullPath &&
    previousRoute.path !== current.path
  ) {
    router.back();
    return Promise.resolve(true);
  }

  return safeReplace(router, fallback);
};
