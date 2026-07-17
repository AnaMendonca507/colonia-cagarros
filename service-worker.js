'use strict';

const CACHE_NAME = 'colonia-cagarros-v1.2.0';
const APP_FILES = [
  './',
  './index.html',
  './styles.css',
  './enhancements.css',
  './app.js',
  './enhancements.js',
  './manifest.webmanifest',
  './CREDITS.md',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/branding/barra-circular-ocean.svg',
  './assets/audio/cagarro_01.mp3',
  './assets/audio/cagarro_02.mp3',
  './assets/audio/cagarro_03.mp3',
  './assets/audio/cagarro_04.mp3',
  './assets/audio/cagarro_05.mp3',
  './assets/audio/cagarro_06.mp3',
  './assets/audio/cagarro_07.mp3',
  './assets/audio/cagarro_08.mp3',
  './assets/audio/cagarro_09.mp3',
  './assets/audio/cagarro_10_curto.mp3',
  './assets/audio/cagarro_11_curto.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
