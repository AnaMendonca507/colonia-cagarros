'use strict';

const MAX_BIRDS = 60;
const ACTIVITIES_STORAGE_KEY = 'colonyActivitiesV1';
const ACTIVE_SESSION_STORAGE_KEY = 'colonyActiveSessionIdV1';
const AUDIO_FILES = [
  'assets/audio/cagarro_01.mp3',
  'assets/audio/cagarro_02.mp3',
  'assets/audio/cagarro_03.mp3',
  'assets/audio/cagarro_04.mp3',
  'assets/audio/cagarro_05.mp3',
  'assets/audio/cagarro_06.mp3',
  'assets/audio/cagarro_07.mp3',
  'assets/audio/cagarro_08.mp3',
  'assets/audio/cagarro_09.mp3',
  'assets/audio/cagarro_10_curto.mp3',
  'assets/audio/cagarro_11_curto.mp3'
];

const LONG_CLIP_COUNT = 9;
const elements = {
  addBirdButton: document.querySelector('#addBirdButton'),
  birdLayer: document.querySelector('#birdLayer'),
  countOutput: document.querySelector('#countOutput'),
  countWord: document.querySelector('#countWord'),
  manualCount: document.querySelector('#manualCount'),
  setCountButton: document.querySelector('#setCountButton'),
  playButton: document.querySelector('#playButton'),
  stopButton: document.querySelector('#stopButton'),
  resetButton: document.querySelector('#resetButton'),
  status: document.querySelector('#status'),
  volumeControl: document.querySelector('#volumeControl'),
  volumeOutput: document.querySelector('#volumeOutput'),
  fullscreenButton: document.querySelector('#fullscreenButton'),
  installButton: document.querySelector('#installButton'),
  statsButton: document.querySelector('#statsButton'),
  statsTotalBadge: document.querySelector('#statsTotalBadge'),
  statsDialog: document.querySelector('#statsDialog'),
  closeStatsButton: document.querySelector('#closeStatsButton'),
  statsMonth: document.querySelector('#statsMonth'),
  statsYear: document.querySelector('#statsYear'),
  filteredParticipants: document.querySelector('#filteredParticipants'),
  filteredActivities: document.querySelector('#filteredActivities'),
  filteredAverage: document.querySelector('#filteredAverage'),
  statsEmpty: document.querySelector('#statsEmpty'),
  activityList: document.querySelector('#activityList'),
  activeSessionLegend: document.querySelector('#activeSessionLegend'),
  creditsButton: document.querySelector('#creditsButton'),
  creditsDialog: document.querySelector('#creditsDialog'),
  closeCreditsButton: document.querySelector('#closeCreditsButton')
};

let activities = loadActivities();
let activeSessionId = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
let birdCount = clampNumber(Number(localStorage.getItem('colonyCount')) || 0);
let audioContext = null;
let audioBuffers = [];
let loadingPromise = null;
let activeSources = [];
let finishTimer = null;
let deferredInstallPrompt = null;

function clampNumber(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_BIRDS, Math.round(value)));
}

function loadActivities() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];

    return stored
      .filter((item) => item && typeof item.id === 'string' && item.startedAt)
      .map((item) => ({
        id: item.id,
        startedAt: item.startedAt,
        updatedAt: item.updatedAt || item.startedAt,
        participants: clampNumber(Number(item.participants))
      }));
  } catch (error) {
    console.warn('Não foi possível ler as estatísticas guardadas:', error);
    return [];
  }
}

function saveActivities() {
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `atividade-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function localDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getActiveSession() {
  if (!activeSessionId) return null;
  return activities.find((activity) => activity.id === activeSessionId) || null;
}

function setActiveSession(id) {
  activeSessionId = id || null;
  if (activeSessionId) {
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, activeSessionId);
  } else {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  }
}

function prepareStoredSession() {
  const activeSession = getActiveSession();
  if (activeSession && localDateKey(activeSession.startedAt) === localDateKey(new Date())) {
    birdCount = clampNumber(activeSession.participants);
    localStorage.setItem('colonyCount', String(birdCount));
    return;
  }

  setActiveSession(null);
  birdCount = 0;
  localStorage.setItem('colonyCount', '0');
}

function recordAutomaticCount() {
  const now = new Date();
  let session = getActiveSession();

  if (session && localDateKey(session.startedAt) !== localDateKey(now)) {
    setActiveSession(null);
    session = null;
  }

  if (!session && birdCount > 0) {
    session = {
      id: createId(),
      startedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      participants: birdCount
    };
    activities.push(session);
    setActiveSession(session.id);
  } else if (session) {
    session.participants = birdCount;
    session.updatedAt = now.toISOString();
  }

  saveActivities();
  updateAllTimeBadge();
  if (elements.statsDialog.open) renderStatistics();
}

function setCount(value, animate = false, record = false) {
  birdCount = clampNumber(value);
  elements.countOutput.value = String(birdCount);
  elements.countOutput.textContent = String(birdCount);
  elements.countWord.textContent = birdCount === 1 ? 'cagarro / participante' : 'cagarros / participantes';
  elements.manualCount.value = String(birdCount);
  elements.playButton.disabled = birdCount === 0;
  localStorage.setItem('colonyCount', String(birdCount));

  if (animate) {
    elements.countOutput.classList.remove('bump');
    void elements.countOutput.offsetWidth;
    elements.countOutput.classList.add('bump');
  }

  setStatus(
    birdCount === 0
      ? 'Adicione pelo menos um cagarro.'
      : `${birdCount} ${birdCount === 1 ? 'participante registado' : 'participantes registados'} automaticamente.`
  );

  if (record) recordAutomaticCount();
}

function setStatus(message, state = '') {
  elements.status.textContent = message;
  elements.status.className = `status${state ? ` ${state}` : ''}`;
}

function createBirdAnimation() {
  const bird = document.createElement('span');
  bird.className = 'flying-bird';
  bird.style.left = `${8 + Math.random() * 54}%`;
  bird.style.top = `${30 + Math.random() * 42}%`;
  bird.style.transform = `scale(${0.75 + Math.random() * 0.5})`;
  elements.birdLayer.appendChild(bird);
  bird.addEventListener('animationend', () => bird.remove(), { once: true });
}

function addBird() {
  if (birdCount >= MAX_BIRDS) {
    setStatus(`A colónia já atingiu o máximo de ${MAX_BIRDS} cagarros.`, 'error');
    return;
  }

  setCount(birdCount + 1, true, true);
  createBirdAnimation();
  elements.addBirdButton.classList.remove('flash');
  void elements.addBirdButton.offsetWidth;
  elements.addBirdButton.classList.add('flash');

  if ('vibrate' in navigator) navigator.vibrate(22);
}

async function ensureAudioReady() {
  if (audioBuffers.length === AUDIO_FILES.length) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Este navegador não suporta a reprodução necessária.');

    audioContext ||= new AudioContextClass();
    if (audioContext.state === 'suspended') await audioContext.resume();

    const responses = await Promise.all(AUDIO_FILES.map((url) => fetch(url)));
    responses.forEach((response) => {
      if (!response.ok) throw new Error(`Não foi possível carregar ${response.url}`);
    });

    const arrays = await Promise.all(responses.map((response) => response.arrayBuffer()));
    audioBuffers = await Promise.all(arrays.map((buffer) => audioContext.decodeAudioData(buffer.slice(0))));
  })();

  try {
    await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

function chooseBuffer() {
  const useShortClip = Math.random() < 0.12;
  const index = useShortClip
    ? LONG_CLIP_COUNT + Math.floor(Math.random() * (AUDIO_FILES.length - LONG_CLIP_COUNT))
    : Math.floor(Math.random() * LONG_CLIP_COUNT);
  return audioBuffers[index];
}

function stopColony(updateStatus = true) {
  if (finishTimer) {
    clearTimeout(finishTimer);
    finishTimer = null;
  }

  activeSources.forEach((source) => {
    try { source.stop(); } catch (_) { /* A fonte já pode ter terminado. */ }
  });
  activeSources = [];
  elements.stopButton.disabled = true;
  elements.playButton.disabled = birdCount === 0;
  if (updateStatus) setStatus('A reprodução foi interrompida.');
}

async function playColony() {
  if (birdCount === 0) {
    setStatus('Adicione pelo menos um cagarro antes de ouvir a colónia.', 'error');
    return;
  }

  stopColony(false);
  elements.playButton.disabled = true;
  elements.stopButton.disabled = false;
  setStatus('A preparar as vocalizações...', 'active');

  try {
    await ensureAudioReady();
    if (audioContext.state === 'suspended') await audioContext.resume();
  } catch (error) {
    console.error(error);
    elements.playButton.disabled = false;
    elements.stopButton.disabled = true;
    setStatus('Não foi possível carregar o som. Confirme o volume e tente novamente.', 'error');
    return;
  }

  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 24;
  compressor.ratio.value = 7;
  compressor.attack.value = 0.006;
  compressor.release.value = 0.34;

  const master = audioContext.createGain();
  master.gain.value = Number(elements.volumeControl.value) / 100;
  compressor.connect(master);
  master.connect(audioContext.destination);

  const startAt = audioContext.currentTime + 0.08;
  const voiceGain = Math.min(0.78, 1.2 / Math.pow(birdCount, 0.57));
  const baseDelayMs = birdCount > 40 ? 82 : 98;
  let latestEnd = startAt;

  for (let i = 0; i < birdCount; i += 1) {
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const buffer = chooseBuffer();
    const jitterSeconds = Math.random() * 0.15;
    const scheduledAt = startAt + (i * baseDelayMs) / 1000 + jitterSeconds;

    source.buffer = buffer;
    source.playbackRate.value = 0.95 + Math.random() * 0.1;
    gain.gain.value = voiceGain * (0.82 + Math.random() * 0.32);

    if (audioContext.createStereoPanner) {
      const panner = audioContext.createStereoPanner();
      panner.pan.value = -0.72 + Math.random() * 1.44;
      source.connect(gain).connect(panner).connect(compressor);
    } else {
      source.connect(gain).connect(compressor);
    }

    source.start(scheduledAt);
    activeSources.push(source);
    latestEnd = Math.max(latestEnd, scheduledAt + buffer.duration / source.playbackRate.value);
    source.addEventListener('ended', () => {
      activeSources = activeSources.filter((item) => item !== source);
    }, { once: true });
  }

  setStatus(`A ouvir uma colónia com ${birdCount} ${birdCount === 1 ? 'cagarro' : 'cagarros'}...`, 'active');

  const finishDelay = Math.max(500, (latestEnd - audioContext.currentTime) * 1000 + 250);
  finishTimer = window.setTimeout(() => {
    activeSources = [];
    elements.stopButton.disabled = true;
    elements.playButton.disabled = birdCount === 0;
    setStatus('A colónia ficou em silêncio. Pode voltar a ouvi-la.');
  }, finishDelay);
}

function applyManualCount() {
  const rawValue = Number(elements.manualCount.value);
  if (!Number.isFinite(rawValue) || rawValue < 0) {
    setStatus('Introduza um número válido de participantes.', 'error');
    return;
  }

  const value = clampNumber(rawValue);
  setCount(value, true, true);
  if (value > 0) createBirdAnimation();
}

function resetActivity() {
  stopColony(false);
  const hadParticipants = birdCount > 0;
  const activeSession = getActiveSession();

  if (activeSession && activeSession.participants === 0) {
    activities = activities.filter((activity) => activity.id !== activeSession.id);
    saveActivities();
  }

  setActiveSession(null);
  setCount(0, true, false);
  updateAllTimeBadge();
  if (elements.statsDialog.open) renderStatistics();
  setStatus(hadParticipants
    ? 'A atividade anterior ficou registada. Pode começar uma nova.'
    : 'Pronta para uma nova atividade.');
}

function updateVolume() {
  const volume = Number(elements.volumeControl.value);
  elements.volumeOutput.value = `${volume}%`;
  elements.volumeOutput.textContent = `${volume}%`;
  localStorage.setItem('colonyVolume', String(volume));
}

function updateAllTimeBadge() {
  const total = activities.reduce((sum, activity) => sum + Math.max(0, activity.participants), 0);
  elements.statsTotalBadge.value = String(total);
  elements.statsTotalBadge.textContent = String(total);
}

function populateYearFilter() {
  const selectedYear = elements.statsYear.value;
  const years = [...new Set(
    activities
      .map((activity) => new Date(activity.startedAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map((date) => date.getFullYear())
  )].sort((a, b) => b - a);

  elements.statsYear.replaceChildren();
  const allYears = document.createElement('option');
  allYears.value = '';
  allYears.textContent = 'Todos os anos';
  elements.statsYear.appendChild(allYears);

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = String(year);
    option.textContent = String(year);
    elements.statsYear.appendChild(option);
  });

  if ([...elements.statsYear.options].some((option) => option.value === selectedYear)) {
    elements.statsYear.value = selectedYear;
  }
}

function getFilteredActivities() {
  const month = Number(elements.statsMonth.value);
  const year = Number(elements.statsYear.value);

  return activities
    .filter((activity) => activity.participants > 0)
    .filter((activity) => {
      const date = new Date(activity.startedAt);
      if (Number.isNaN(date.getTime())) return false;
      if (month && date.getMonth() + 1 !== month) return false;
      if (year && date.getFullYear() !== year) return false;
      return true;
    })
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

function formatActivityDate(activity) {
  const date = new Date(activity.startedAt);
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function renderActivityList(filtered) {
  elements.activityList.replaceChildren();
  elements.statsEmpty.classList.toggle('hidden', filtered.length > 0);
  const activeVisible = filtered.some((activity) => activity.id === activeSessionId);
  elements.activeSessionLegend.classList.toggle('hidden', !activeVisible);

  filtered.forEach((activity) => {
    const item = document.createElement('li');
    item.className = 'activity-item';
    if (activity.id === activeSessionId) item.classList.add('is-active');

    const dateBlock = document.createElement('div');
    dateBlock.className = 'activity-date';

    const dateText = document.createElement('strong');
    dateText.textContent = formatActivityDate(activity);
    dateBlock.appendChild(dateText);

    if (activity.id === activeSessionId) {
      const activeText = document.createElement('span');
      activeText.textContent = 'Atividade em curso';
      dateBlock.appendChild(activeText);
    }

    const count = document.createElement('output');
    count.className = 'activity-participants';
    count.value = String(activity.participants);
    count.textContent = `${activity.participants} ${activity.participants === 1 ? 'participante' : 'participantes'}`;

    item.append(dateBlock, count);
    elements.activityList.appendChild(item);
  });
}

function renderStatistics() {
  populateYearFilter();
  const filtered = getFilteredActivities();
  const totalParticipants = filtered.reduce((sum, activity) => sum + activity.participants, 0);
  const activityCount = filtered.length;
  const average = activityCount ? totalParticipants / activityCount : 0;

  elements.filteredParticipants.value = String(totalParticipants);
  elements.filteredParticipants.textContent = String(totalParticipants);
  elements.filteredActivities.value = String(activityCount);
  elements.filteredActivities.textContent = String(activityCount);
  elements.filteredAverage.value = String(Math.round(average * 10) / 10);
  elements.filteredAverage.textContent = average.toLocaleString('pt-PT', {
    minimumFractionDigits: average % 1 ? 1 : 0,
    maximumFractionDigits: 1
  });

  renderActivityList(filtered);
}

function openStatistics() {
  renderStatistics();
  elements.statsDialog.showModal();
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  } catch (_) {
    setStatus('O modo de ecrã inteiro não está disponível neste dispositivo.', 'error');
  }
}

function closeDialogOnBackdrop(dialog, event) {
  if (event.target === dialog) dialog.close();
}

elements.addBirdButton.addEventListener('click', addBird);
elements.setCountButton.addEventListener('click', applyManualCount);
elements.manualCount.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') applyManualCount();
});
elements.playButton.addEventListener('click', playColony);
elements.stopButton.addEventListener('click', () => stopColony(true));
elements.resetButton.addEventListener('click', resetActivity);
elements.volumeControl.addEventListener('input', updateVolume);
elements.fullscreenButton.addEventListener('click', toggleFullscreen);
elements.statsButton.addEventListener('click', openStatistics);
elements.closeStatsButton.addEventListener('click', () => elements.statsDialog.close());
elements.statsMonth.addEventListener('change', renderStatistics);
elements.statsYear.addEventListener('change', renderStatistics);
elements.statsDialog.addEventListener('click', (event) => closeDialogOnBackdrop(elements.statsDialog, event));
elements.creditsButton.addEventListener('click', () => elements.creditsDialog.showModal());
elements.closeCreditsButton.addEventListener('click', () => elements.creditsDialog.close());
elements.creditsDialog.addEventListener('click', (event) => closeDialogOnBackdrop(elements.creditsDialog, event));

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  elements.installButton.classList.remove('hidden');
});

elements.installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  elements.installButton.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  elements.installButton.classList.add('hidden');
  setStatus('A aplicação foi instalada no tablet.');
});

prepareStoredSession();

const savedVolume = Number(localStorage.getItem('colonyVolume'));
if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 100) {
  elements.volumeControl.value = String(savedVolume);
}
updateVolume();
setCount(birdCount);
updateAllTimeBadge();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => {
      console.warn('Service worker não registado:', error);
    });
  });
}
