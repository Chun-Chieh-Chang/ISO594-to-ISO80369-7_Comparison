// ISO 594 → ISO 80369-7 Audit Suite — Service Worker
// 快取名稱須隨每次發版變更，否則舊快取不會被清除。
const CACHE_NAME = 'lueraudit-pwa-v1.2.0';

// 應用殼層。建置產物（帶雜湊的 JS/CSS）於首次載入時由 fetch 處理器寫入快取，
// 因此離線可用的前提是「至少完整連網載入過一次」。
const PRECACHE_ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // 個別加入，避免單一資源 404 導致整批 addAll 失敗而安裝不成功
      Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[sw] precache skipped:', url, err))
        )
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/** 離線且快取未命中時的保底回應：依序嘗試 index.html 與根路徑 */
async function navigationFallback() {
  const cache = await caches.open(CACHE_NAME);
  const cached = (await cache.match('./index.html')) || (await cache.match('./'));
  return (
    cached ||
    new Response('離線中，且尚未快取此頁面。請於連線狀態下重新載入一次。', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;
  // 只處理同源請求，避免快取第三方回應
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      // Stale-while-revalidate：先回快取，背景更新
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => undefined);

      if (cached) {
        // 背景更新失敗不應造成未處理的 rejection
        event.waitUntil(network);
        return cached;
      }

      const response = await network;
      if (response) return response;

      if (request.mode === 'navigate') return navigationFallback();
      return new Response('', { status: 504, statusText: 'Offline and not cached' });
    })()
  );
});
