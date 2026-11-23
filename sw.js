/* Zeke · service worker: la página siempre se pide fresca; las fotos se guardan para que cargue rápido. */
const C = 'zeke-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const put = res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; };
  if (u.pathname.includes('/img/')) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(put)));
    return;
  }
  e.respondWith(fetch(r).then(put).catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
