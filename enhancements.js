'use strict';

const clearDataButton = document.querySelector('#clearDataButton');

clearDataButton?.addEventListener('click', () => {
  const confirmed = window.confirm(
    'Tem a certeza de que pretende apagar todas as atividades e participantes guardados neste dispositivo? Esta ação não pode ser anulada.'
  );

  if (!confirmed) return;

  localStorage.removeItem('colonyActivitiesV1');
  localStorage.removeItem('colonyActiveSessionIdV1');
  localStorage.removeItem('colonyCount');
  window.location.reload();
});
