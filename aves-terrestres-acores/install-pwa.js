'use strict';

(() => {
  const installButton = document.querySelector('#installAppButton');
  let deferredPrompt = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  function updateButton() {
    if (!installButton) return;
    installButton.hidden = isStandalone();
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.warn('Não foi possível registar o service worker:', error);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    updateButton();
  });

  installButton?.addEventListener('click', async () => {
    if (isStandalone()) {
      installButton.hidden = true;
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome === 'accepted') installButton.hidden = true;
      return;
    }

    if (isIOS()) {
      window.alert('No Safari, toca no botão Partilhar e escolhe “Adicionar ao ecrã principal”.');
      return;
    }

    window.alert('Abre o menu do navegador e escolhe “Instalar aplicação” ou “Adicionar ao ecrã principal”.');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installButton) installButton.hidden = true;
  });

  updateButton();
})();
