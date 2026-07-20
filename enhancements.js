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

const CONTINUOUS_AUDIO_FILES = [
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

const CONTINUOUS_LONG_CLIP_COUNT = 9;
let continuousAudioContext = null;
let continuousAudioBuffers = [];
let continuousLoadingPromise = null;
let continuousSources = [];
let continuousMasterGain = null;
let continuousIsPlaying = false;

const originalPlayButton = document.querySelector('#playButton');
const originalStopButton = document.querySelector('#stopButton');

const continuousPlayButton = originalPlayButton?.cloneNode(true);
const continuousStopButton = originalStopButton?.cloneNode(true);

if (originalPlayButton && continuousPlayButton) originalPlayButton.replaceWith(continuousPlayButton);
if (originalStopButton && continuousStopButton) originalStopButton.replaceWith(continuousStopButton);

const continuousCountOutput = document.querySelector('#countOutput');
const continuousStatus = document.querySelector('#status');
const continuousVolumeControl = document.querySelector('#volumeControl');
const continuousResetButton = document.querySelector('#resetButton');

function getContinuousBirdCount() {
  const value = Number(continuousCountOutput?.value || continuousCountOutput?.textContent || 0);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function setContinuousStatus(message, state = '') {
  if (!continuousStatus) return;
  continuousStatus.textContent = message;
  continuousStatus.className = `status${state ? ` ${state}` : ''}`;
}

function syncContinuousButtons() {
  const birdCount = getContinuousBirdCount();
  if (continuousPlayButton) continuousPlayButton.disabled = continuousIsPlaying || birdCount === 0;
  if (continuousStopButton) continuousStopButton.disabled = !continuousIsPlaying;
}

async function ensureContinuousAudioReady() {
  if (continuousAudioBuffers.length === CONTINUOUS_AUDIO_FILES.length) return;
  if (continuousLoadingPromise) return continuousLoadingPromise;

  continuousLoadingPromise = (async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Este navegador não suporta a reprodução necessária.');

    continuousAudioContext ||= new AudioContextClass();
    if (continuousAudioContext.state === 'suspended') await continuousAudioContext.resume();

    const responses = await Promise.all(CONTINUOUS_AUDIO_FILES.map((url) => fetch(url)));
    responses.forEach((response) => {
      if (!response.ok) throw new Error(`Não foi possível carregar ${response.url}`);
    });

    const arrays = await Promise.all(responses.map((response) => response.arrayBuffer()));
    continuousAudioBuffers = await Promise.all(
      arrays.map((buffer) => continuousAudioContext.decodeAudioData(buffer.slice(0)))
    );
  })();

  try {
    await continuousLoadingPromise;
  } finally {
    continuousLoadingPromise = null;
  }
}

function chooseContinuousBuffer() {
  const useShortClip = Math.random() < 0.12;
  const index = useShortClip
    ? CONTINUOUS_LONG_CLIP_COUNT
      + Math.floor(Math.random() * (CONTINUOUS_AUDIO_FILES.length - CONTINUOUS_LONG_CLIP_COUNT))
    : Math.floor(Math.random() * CONTINUOUS_LONG_CLIP_COUNT);
  return continuousAudioBuffers[index];
}

function stopContinuousColony(updateStatus = true) {
  continuousSources.forEach((source) => {
    try { source.stop(); } catch (_) { /* A fonte já pode ter sido interrompida. */ }
  });

  continuousSources = [];
  continuousMasterGain = null;
  continuousIsPlaying = false;
  syncContinuousButtons();

  if (updateStatus) setContinuousStatus('A reprodução foi interrompida.');
}

async function playContinuousColony() {
  const birdCount = getContinuousBirdCount();

  if (birdCount === 0) {
    setContinuousStatus('Adicione pelo menos um cagarro antes de ouvir a colónia.', 'error');
    syncContinuousButtons();
    return;
  }

  stopContinuousColony(false);
  continuousIsPlaying = true;
  syncContinuousButtons();
  setContinuousStatus('A preparar as vocalizações...', 'active');

  try {
    await ensureContinuousAudioReady();
    if (continuousAudioContext.state === 'suspended') await continuousAudioContext.resume();
  } catch (error) {
    console.error(error);
    continuousIsPlaying = false;
    syncContinuousButtons();
    setContinuousStatus('Não foi possível carregar o som. Confirme o volume e tente novamente.', 'error');
    return;
  }

  if (!continuousIsPlaying) return;

  const compressor = continuousAudioContext.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 24;
  compressor.ratio.value = 7;
  compressor.attack.value = 0.006;
  compressor.release.value = 0.34;

  continuousMasterGain = continuousAudioContext.createGain();
  continuousMasterGain.gain.value = Number(continuousVolumeControl?.value || 78) / 100;
  compressor.connect(continuousMasterGain);
  continuousMasterGain.connect(continuousAudioContext.destination);

  const startAt = continuousAudioContext.currentTime + 0.08;
  const voiceGain = Math.min(0.78, 1.2 / Math.pow(birdCount, 0.57));
  const baseDelayMs = birdCount > 40 ? 82 : 98;

  for (let i = 0; i < birdCount; i += 1) {
    const source = continuousAudioContext.createBufferSource();
    const gain = continuousAudioContext.createGain();
    const buffer = chooseContinuousBuffer();
    const jitterSeconds = Math.random() * 0.15;
    const scheduledAt = startAt + (i * baseDelayMs) / 1000 + jitterSeconds;

    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = 0.95 + Math.random() * 0.1;
    gain.gain.value = voiceGain * (0.82 + Math.random() * 0.32);

    if (continuousAudioContext.createStereoPanner) {
      const panner = continuousAudioContext.createStereoPanner();
      panner.pan.value = -0.72 + Math.random() * 1.44;
      source.connect(gain).connect(panner).connect(compressor);
    } else {
      source.connect(gain).connect(compressor);
    }

    source.start(scheduledAt);
    continuousSources.push(source);
  }

  setContinuousStatus(
    `A ouvir continuamente uma colónia com ${birdCount} ${birdCount === 1 ? 'cagarro' : 'cagarros'}. Carregue em Parar para terminar.`,
    'active'
  );
}

continuousPlayButton?.addEventListener('click', playContinuousColony);
continuousStopButton?.addEventListener('click', () => stopContinuousColony(true));
continuousResetButton?.addEventListener('click', () => stopContinuousColony(false));

continuousVolumeControl?.addEventListener('input', () => {
  if (!continuousMasterGain || !continuousAudioContext) return;
  const volume = Number(continuousVolumeControl.value) / 100;
  continuousMasterGain.gain.setTargetAtTime(volume, continuousAudioContext.currentTime, 0.02);
});

if (continuousCountOutput) {
  const countObserver = new MutationObserver(syncContinuousButtons);
  countObserver.observe(continuousCountOutput, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['value']
  });
}

syncContinuousButtons();
