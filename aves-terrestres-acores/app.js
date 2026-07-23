'use strict';

const speciesLibrary = [
  {
    id: 'melro',
    name: 'Melro-negro',
    scientific: 'Turdus merula azorensis',
    initials: 'ME',
    recordings: [
      { id: '812548', type: 'Canto', sex: 'Não indicado', location: 'Praia da Vitória, ilha Terceira, Açores', recordist: 'Carlos Pereira' },
      { id: '785201', type: 'Chamamento e voo', sex: 'Não indicado', location: 'Terra Brava e Criação das Lagoas, ilha Terceira, Açores', recordist: 'Carlos Pereira' }
    ]
  },
  {
    id: 'toutinegra',
    name: 'Toutinegra',
    scientific: 'Sylvia atricapilla',
    initials: 'TO',
    recordings: [
      { id: '817414', type: 'Canto', sex: 'Macho', location: 'Paul da Pedreira do Cabo da Praia, ilha Terceira, Açores', recordist: 'Carlos Pereira' },
      { id: '759454', type: 'Alarme', sex: 'Não indicado', location: 'Rocha do Penedo, ilha Terceira, Açores', recordist: 'Consultar ficha' }
    ]
  },
  {
    id: 'tentilhao',
    name: 'Tentilhão dos Açores',
    scientific: 'Fringilla coelebs moreletti',
    initials: 'TE',
    recordings: [
      { id: '263262', type: 'Canto', sex: 'Não indicado', location: 'Furnas, São Miguel, Açores', recordist: 'Cedric Mroczko' },
      { id: '263194', type: 'Chamamento', sex: 'Macho', location: 'Açores', recordist: 'Cedric Mroczko' }
    ]
  },
  {
    id: 'priolo',
    name: 'Priolo',
    scientific: 'Pyrrhula murina',
    initials: 'PR',
    pending: 'Ainda não foi localizada uma gravação elegível desta espécie no Xeno-canto. A carta fica preparada para receber um ficheiro validado.'
  },
  {
    id: 'milhafre',
    name: 'Milhafre · águia-de-asa-redonda',
    scientific: 'Buteo buteo rothschildi',
    initials: 'MI',
    recordings: [
      { id: '484943', type: 'Chamamento', sex: 'Não indicado', location: 'Ilha Terceira, Açores', recordist: 'Baltasar' },
      { id: '490034', type: 'Chamamento', sex: 'Não indicado', location: 'Ilha Terceira, Açores', recordist: 'Baltasar Pinheiro' }
    ]
  },
  {
    id: 'estrelinha',
    name: 'Estrelinha',
    scientific: 'Regulus regulus',
    initials: 'ES',
    recordings: [
      { id: '831497', type: 'Canto', sex: 'Não indicado', location: 'Cabrita, ilha Terceira, Açores', recordist: 'Carlos Pereira' },
      { id: '257167', type: 'Chamamento', sex: 'Não indicado', location: 'Açores', recordist: 'Cedric Mroczko' }
    ]
  },
  {
    id: 'pisco',
    name: 'Pisco-de-peito-ruivo',
    scientific: 'Erithacus rubecula',
    initials: 'PI',
    recordings: [
      { id: '790990', type: 'Canto', sex: 'Não indicado', location: 'Pau Velho, Praia da Vitória, ilha Terceira, Açores', recordist: 'Carlos Pereira' },
      { id: '785347', type: 'Canto', sex: 'Não indicado', location: 'Doze Ribeiras, ilha Terceira, Açores', recordist: 'Carlos Pereira' }
    ]
  },
  {
    id: 'estorninho',
    name: 'Estorninho dos Açores',
    scientific: 'Sturnus vulgaris granti',
    initials: 'ET',
    recordings: [
      { id: '815285', type: 'Alarme', sex: 'Não indicado', location: 'Pico Gaspar, ilha Terceira, Açores', recordist: 'Carlos Pereira' },
      { id: '817410', type: 'Vocalização', sex: 'Não indicado', location: 'Paul da Pedreira do Cabo da Praia, ilha Terceira, Açores', recordist: 'Carlos Pereira' }
    ]
  },
  {
    id: 'pombo',
    name: 'Pombo-torcaz dos Açores',
    scientific: 'Columba palumbus azorica',
    initials: 'PT',
    recordings: [
      { id: '808334', type: 'Canto', sex: 'Não indicado', location: 'Mata da Serreta, ilha Terceira, Açores', recordist: 'Carlos Pereira' },
      { id: '814313', type: 'Canto e batimento de asas', sex: 'Não indicado', location: 'Pau Velho, Praia da Vitória, ilha Terceira, Açores', recordist: 'Carlos Pereira' }
    ]
  },
  {
    id: 'pintassilgo',
    name: 'Pintassilgo',
    scientific: 'Carduelis carduelis parva',
    initials: 'PN',
    recordings: [
      { id: '806664', type: 'Canto', sex: 'Não indicado', location: 'Fojo, ilha do Corvo, Açores', recordist: 'Carlos Pereira' },
      { id: '784805', type: 'Chamamento', sex: 'Não indicado', location: 'Monte Brasil, ilha Terceira, Açores', recordist: 'Carlos Pereira' }
    ]
  },
  {
    id: 'canario',
    name: 'Canário-da-terra',
    scientific: 'Serinus canaria',
    initials: 'CA',
    recordings: [
      { id: '842459', type: 'Canto', sex: 'Não indicado', location: 'Ilha do Pico, Açores', recordist: 'Carlos Pereira' },
      { id: '842457', type: 'Chamamento e voo', sex: 'Não indicado', location: 'Ilha do Pico, Açores', recordist: 'Carlos Pereira' }
    ]
  },
  {
    id: 'verdilhao',
    name: 'Verdilhão',
    scientific: 'Chloris chloris',
    initials: 'VE',
    pending: 'Foi localizada uma gravação candidata, XC789777, mas a ficha apresenta apenas “Santo António”. A reprodução fica bloqueada até a localização açoriana ser confirmada sem margem para dúvida.'
  },
  {
    id: 'mocho',
    name: 'Mocho · bufo-pequeno',
    scientific: 'Asio otus',
    initials: 'MO',
    recordings: [
      { id: '736196', type: 'Chamamento', sex: 'Fêmea e juvenis', location: 'Raminho, ilha Terceira, Açores', recordist: 'Baltasar Pinheiro' },
      { id: '815736', type: 'Pedido de alimento e voo noturno', sex: 'Juvenil', location: 'Quinta da Vinagreira, ilha Terceira, Açores', recordist: 'Carlos Pereira' }
    ]
  }
];

const elements = {
  grid: document.querySelector('#speciesGrid'),
  search: document.querySelector('#searchInput'),
  sexFilters: document.querySelector('#sexFilters'),
  typeFilters: document.querySelector('#typeFilters'),
  visibleCount: document.querySelector('#visibleCount'),
  selectVisible: document.querySelector('#selectVisibleButton'),
  clearFilters: document.querySelector('#clearFiltersButton'),
  clearSelection: document.querySelector('#clearSelectionButton'),
  play: document.querySelector('#playButton'),
  stop: document.querySelector('#stopButton'),
  selectionTitle: document.querySelector('#selectionTitle'),
  selectionDetail: document.querySelector('#selectionDetail'),
  volume: document.querySelector('#volumeControl'),
  volumeOutput: document.querySelector('#volumeOutput'),
  status: document.querySelector('#status'),
  infoButton: document.querySelector('#infoButton'),
  infoDialog: document.querySelector('#infoDialog'),
  closeInfoButton: document.querySelector('#closeInfoButton')
};

const recordings = speciesLibrary.flatMap((species) =>
  (species.recordings || []).map((recording) => ({ ...recording, speciesId: species.id, speciesName: species.name }))
);

const selectedIds = new Set();
const activeAudio = new Map();
let isPlaying = false;

function normalise(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-PT'));
}

function renderFilterChips(container, values, groupName) {
  container.replaceChildren();
  values.forEach((value) => {
    const label = document.createElement('label');
    label.className = 'filter-chip';
    label.innerHTML = `<input type="checkbox" name="${groupName}" value="${value}"><span>${value}</span>`;
    container.appendChild(label);
  });
}

renderFilterChips(elements.sexFilters, uniqueSorted(recordings.map((item) => item.sex)), 'sex');
renderFilterChips(elements.typeFilters, uniqueSorted(recordings.map((item) => item.type)), 'type');

function checkedValues(container) {
  return new Set([...container.querySelectorAll('input:checked')].map((input) => input.value));
}

function filteredSpecies() {
  const term = normalise(elements.search.value);
  const sexes = checkedValues(elements.sexFilters);
  const types = checkedValues(elements.typeFilters);

  return speciesLibrary.map((species) => {
    const matchesSearch = !term || normalise(`${species.name} ${species.scientific}`).includes(term);
    if (!matchesSearch) return null;
    if (species.pending) return sexes.size || types.size ? null : species;

    const matchingRecordings = species.recordings.filter((recording) => {
      if (sexes.size && !sexes.has(recording.sex)) return false;
      if (types.size && !types.has(recording.type)) return false;
      return true;
    });

    if (!matchingRecordings.length) return null;
    return { ...species, recordings: matchingRecordings };
  }).filter(Boolean);
}

function recordingCard(recording) {
  const checked = selectedIds.has(recording.id) ? 'checked' : '';
  return `
    <label class="recording-option">
      <input type="checkbox" value="${recording.id}" ${checked} aria-label="Selecionar ${recording.type} de ${recording.speciesName || ''}">
      <span class="recording-copy">
        <strong>${recording.type}</strong>
        <span class="tag-row">
          <span class="tag">${recording.sex}</span>
          <span class="tag">XC${recording.id}</span>
        </span>
        <span class="recording-meta">${recording.location}<br>Gravação: ${recording.recordist}</span>
        <a class="source-link" href="https://xeno-canto.org/${recording.id}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Ver no Xeno-canto ↗</a>
      </span>
    </label>`;
}

function renderCatalogue() {
  const filtered = filteredSpecies();
  elements.grid.replaceChildren();

  if (!filtered.length) {
    elements.grid.innerHTML = '<div class="no-results"><strong>Nenhuma espécie corresponde aos filtros.</strong><br>Experimenta retirar um filtro ou alterar a pesquisa.</div>';
  }

  filtered.forEach((species) => {
    const article = document.createElement('article');
    article.className = `species-card${species.pending ? ' pending' : ''}`;
    article.dataset.speciesId = species.id;

    const header = `
      <div class="species-header">
        <span class="species-avatar" aria-hidden="true">${species.initials}</span>
        <div class="species-title"><h3>${species.name}</h3><p>${species.scientific}</p></div>
        <span class="recording-total">${species.pending ? 'Pendente' : `${species.recordings.length} ${species.recordings.length === 1 ? 'som' : 'sons'}`}</span>
      </div>`;

    article.innerHTML = species.pending
      ? `${header}<div class="pending-box">${species.pending}</div>`
      : `${header}<div class="recordings">${species.recordings.map((item) => recordingCard({ ...item, speciesName: species.name })).join('')}</div>`;

    elements.grid.appendChild(article);
  });

  elements.visibleCount.value = `${filtered.length} espécies`;
  elements.visibleCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'espécie' : 'espécies'}`;
  bindRecordingInputs();
}

function bindRecordingInputs() {
  elements.grid.querySelectorAll('.recording-option input').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) selectedIds.add(input.value);
      else selectedIds.delete(input.value);
      updateMixer();
    });
  });
}

function selectedRecordings() {
  return recordings.filter((recording) => selectedIds.has(recording.id));
}

function updateMixer() {
  const selected = selectedRecordings();
  const speciesCount = new Set(selected.map((item) => item.speciesId)).size;

  elements.selectionTitle.textContent = selected.length
    ? `${selected.length} ${selected.length === 1 ? 'gravação selecionada' : 'gravações selecionadas'}`
    : 'Nenhuma gravação selecionada';
  elements.selectionDetail.textContent = selected.length
    ? `${speciesCount} ${speciesCount === 1 ? 'espécie' : 'espécies'} na mistura`
    : 'Escolhe uma ou mais vocalizações.';

  elements.play.disabled = !selected.length || isPlaying;
  elements.stop.disabled = !isPlaying;
  elements.clearSelection.disabled = !selected.length;
}

function setStatus(message, state = '') {
  elements.status.textContent = message;
  elements.status.className = `status${state ? ` ${state}` : ''}`;
}

function audioUrl(id) {
  return `https://xeno-canto.org/${id}/download`;
}

function stopAll(updateStatus = true) {
  activeAudio.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
  });
  activeAudio.clear();
  isPlaying = false;
  updateMixer();
  if (updateStatus) setStatus('A floresta ficou em silêncio.');
}

async function playSelection() {
  const selected = selectedRecordings();
  if (!selected.length) return;

  stopAll(false);
  isPlaying = true;
  updateMixer();
  setStatus('A carregar as vocalizações selecionadas…', 'active');

  const volume = Number(elements.volume.value) / 100;
  const results = await Promise.allSettled(selected.map(async (recording, index) => {
    const audio = new Audio(audioUrl(recording.id));
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    activeAudio.set(recording.id, audio);
    await new Promise((resolve) => window.setTimeout(resolve, index * 95));
    return audio.play();
  }));

  const failed = results.filter((result) => result.status === 'rejected').length;
  if (failed === selected.length) {
    stopAll(false);
    setStatus('Não foi possível carregar os sons. Confirma a ligação à internet e tenta novamente.', 'error');
    return;
  }

  const playing = selected.length - failed;
  setStatus(
    failed
      ? `${playing} gravações estão a tocar; ${failed} não carregaram.`
      : `${playing} ${playing === 1 ? 'gravação está' : 'gravações estão'} a tocar em ciclo.`,
    failed ? 'error' : 'active'
  );
}

function clearSelection() {
  stopAll(false);
  selectedIds.clear();
  renderCatalogue();
  updateMixer();
  setStatus('Seleção limpa. A floresta está em silêncio.');
}

function selectVisibleRecordings() {
  filteredSpecies().forEach((species) => {
    (species.recordings || []).forEach((recording) => selectedIds.add(recording.id));
  });
  renderCatalogue();
  updateMixer();
}

function clearFilters() {
  elements.search.value = '';
  [...elements.sexFilters.querySelectorAll('input'), ...elements.typeFilters.querySelectorAll('input')]
    .forEach((input) => { input.checked = false; });
  renderCatalogue();
}

[elements.sexFilters, elements.typeFilters].forEach((container) => container.addEventListener('change', renderCatalogue));
elements.search.addEventListener('input', renderCatalogue);
elements.selectVisible.addEventListener('click', selectVisibleRecordings);
elements.clearFilters.addEventListener('click', clearFilters);
elements.clearSelection.addEventListener('click', clearSelection);
elements.play.addEventListener('click', playSelection);
elements.stop.addEventListener('click', () => stopAll(true));

elements.volume.addEventListener('input', () => {
  const volume = Number(elements.volume.value) / 100;
  elements.volumeOutput.value = `${elements.volume.value}%`;
  elements.volumeOutput.textContent = `${elements.volume.value}%`;
  activeAudio.forEach((audio) => { audio.volume = volume; });
});

elements.infoButton.addEventListener('click', () => elements.infoDialog.showModal());
elements.closeInfoButton.addEventListener('click', () => elements.infoDialog.close());
elements.infoDialog.addEventListener('click', (event) => {
  if (event.target === elements.infoDialog) elements.infoDialog.close();
});

window.addEventListener('beforeunload', () => stopAll(false));

renderCatalogue();
updateMixer();
