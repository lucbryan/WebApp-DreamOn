// Define o nome do cache atual, considerando a sua versão.
var cacheName = 'toSonhando-v1.0';

// Armazena todos os arquivos no cache atual
self.addEventListener('install', function(event) {
  caches.open(cacheName).then((cache) => {
    cache.addAll([
      '/',
      '/index.html',
      '/manifest.webmanifest',
      '/css/tesi.css',
      '/js/tesi.js',
      '/cs/style.css',
      '/js/script.js',

      '/imgs/clouds2.png',
      '/imgs/clouds3.png',
      '/imgs/config.png',
      '/imgs/darkMode.png',
      '/imgs/delete.png',
      '/imgs/edit_white.png',
      '/imgs/edit.png',
      '/imgs/favicon.png',

      '/imgs/filter.png',
      '/imgs/lightMode.png',
      '/imgs/logo.png',
      '/imgs/plus0.png',
      '/imgs/plus1.png',


      '/imgs/sleepGif/1.png',
      '/imgs/sleepGif/2.png',
      '/imgs/sleepGif/3.png',
      '/imgs/sleepGif/4.png',
      '/imgs/sleepGif/5.png',
      '/imgs/sleepGif/6.png',


      '/imgs/icones/apple-icon-180x180.png',

    ]);
  });
});


// Recupera todos os nomes de cache e apaga aqueles
// que forem diferentes do cache atual
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});


// Tenta servir o arquivo do cache atual. Se não for possível,
// baixa o recurso da web e o armazena localmente, antes de entregar
// uma cópia para o usuário.
self.addEventListener('fetch', function(event) {
  let resposta = caches.open(cacheName).then((cache) => {
    return cache.match(event.request).then((recurso) => {
      if (recurso) return recurso;
      return fetch(event.request).then((recurso) => {
        cache.put(event.request, recurso.clone());
        return recurso;
      });
    });
  });
  event.respondWith(resposta);
});

