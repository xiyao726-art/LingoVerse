/* ============================================================
 * 语界 LingoVerse —— Service Worker
 * 策略：安装时预缓存应用外壳；运行时 network-first（保证更新即时），
 *       网络失败时回退缓存；导航请求统一回退 index.html（SPA）。
 * 升级：修改 CACHE 版本号即可让所有客户端刷新缓存。
 * ============================================================ */
const CACHE = "lingoverse-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/data.js",
  "./js/store.js",
  "./js/speech.js",
  "./js/learn.js",
  "./js/social.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return; // 不拦截跨域（浏览器语音能力等）

  // 页面导航：network-first，离线时回退缓存的 index.html
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // 静态资源：stale-while-revalidate —— 有缓存立即响应（离线/弱网秒开），
  // 同时后台拉取新版本更新缓存；无缓存时走网络，网络失败再尝试去查询串兜底
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (cached) return cached;
          if (url.search) return caches.match(url.pathname);
          return Response.error();
        });
      return cached || network;
    })
  );
});
