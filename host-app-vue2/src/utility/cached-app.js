// cache.js (create this new file)
let cachedAppInstance = null;
let isAppMounted = false;

export function getCachedApp() {
  return { cachedAppInstance, isAppMounted };
}

export function setCachedApp(app) {
  cachedAppInstance = app;
  isAppMounted = true;
}

export function clearCachedApp() {
  if (cachedAppInstance && typeof cachedAppInstance.unmount === 'function') {
    cachedAppInstance.unmount();
  }
  cachedAppInstance = null;
  isAppMounted = false;
}
