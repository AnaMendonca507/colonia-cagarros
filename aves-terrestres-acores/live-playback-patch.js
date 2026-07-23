'use strict';

(() => {
  function recordingById(id) {
    return recordings.find((recording) => recording.id === id);
  }

  function updatePlaybackState() {
    isPlaying = activeAudio.size > 0;
  }

  function updateLiveStatus() {
    const playing = activeAudio.size;
    if (!playing) {
      setStatus(selectedIds.size ? 'Seleção pronta. Toca num som para o ouvir ou usa “Tocar seleção”.' : 'A floresta está em silêncio.');
      return;
    }

    setStatus(
      `${playing} ${playing === 1 ? 'gravação está' : 'gravações estão'} a tocar. Podes adicionar ou retirar sons quando quiseres.`,
      'active'
    );
  }

  async function startRecording(recording) {
    if (!recording || activeAudio.has(recording.id)) return true;

    const audio = new Audio(audioUrl(recording.id));
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = Number(elements.volume.value) / 100;
    activeAudio.set(recording.id, audio);
    updatePlaybackState();
    updateMixer();

    try {
      await audio.play();
      updateLiveStatus();
      return true;
    } catch (error) {
      audio.pause();
      audio.src = '';
      activeAudio.delete(recording.id);
      updatePlaybackState();
      updateMixer();
      setStatus(`Não foi possível carregar ${recording.speciesName || 'esta gravação'}. Confirma a ligação à internet e tenta novamente.`, 'error');
      return false;
    }
  }

  function stopRecording(id) {
    const audio = activeAudio.get(id);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
    activeAudio.delete(id);
    updatePlaybackState();
    updateMixer();
    updateLiveStatus();
  }

  bindRecordingInputs = function bindLiveRecordingInputs() {
    elements.grid.querySelectorAll('.recording-option input').forEach((input) => {
      input.addEventListener('change', async () => {
        const recording = recordingById(input.value);

        if (input.checked) {
          selectedIds.add(input.value);
          updateMixer();
          await startRecording(recording);
        } else {
          selectedIds.delete(input.value);
          stopRecording(input.value);
          updateMixer();
        }
      });
    });
  };

  updateMixer = function updateLiveMixer() {
    const selected = selectedRecordings();
    const speciesCount = new Set(selected.map((item) => item.speciesId)).size;
    const silentSelected = selected.filter((item) => !activeAudio.has(item.id)).length;

    elements.selectionTitle.textContent = selected.length
      ? `${selected.length} ${selected.length === 1 ? 'gravação selecionada' : 'gravações selecionadas'}`
      : 'Nenhuma gravação selecionada';
    elements.selectionDetail.textContent = selected.length
      ? `${speciesCount} ${speciesCount === 1 ? 'espécie' : 'espécies'} · ${activeAudio.size} a tocar`
      : 'Toca numa vocalização para a ouvires.';

    elements.play.disabled = !selected.length || !silentSelected;
    elements.stop.disabled = activeAudio.size === 0;
    elements.clearSelection.disabled = !selected.length;
  };

  stopAll = function stopAllLive(updateStatus = true) {
    playbackSession += 1;
    activeAudio.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    });
    activeAudio.clear();
    updatePlaybackState();
    updateMixer();
    if (updateStatus) setStatus(selectedIds.size ? 'Reprodução parada. A seleção foi mantida.' : 'A floresta ficou em silêncio.');
  };

  playSelection = async function playLiveSelection() {
    const selected = selectedRecordings();
    if (!selected.length) return;

    const missing = selected.filter((recording) => !activeAudio.has(recording.id));
    if (!missing.length) return;

    setStatus('A carregar as vocalizações selecionadas…', 'active');
    await Promise.all(missing.map((recording) => startRecording(recording)));
    updatePlaybackState();
    updateMixer();
    updateLiveStatus();
  };

  clearSelection = function clearLiveSelection() {
    stopAll(false);
    selectedIds.clear();
    renderCatalogue();
    updateMixer();
    setStatus('Seleção limpa. A floresta está em silêncio.');
  };

  selectVisibleRecordings = async function selectAndPlayVisibleRecordings() {
    const newlySelected = [];

    filteredSpecies().forEach((species) => {
      (species.recordings || []).forEach((recording) => {
        if (!selectedIds.has(recording.id)) newlySelected.push(recordingById(recording.id));
        selectedIds.add(recording.id);
      });
    });

    renderCatalogue();
    updateMixer();
    await Promise.all(newlySelected.filter(Boolean).map((recording) => startRecording(recording)));
  };

  const replaceButton = (key) => {
    const oldButton = elements[key];
    const newButton = oldButton.cloneNode(true);
    oldButton.replaceWith(newButton);
    elements[key] = newButton;
  };

  replaceButton('play');
  replaceButton('stop');
  replaceButton('clearSelection');
  replaceButton('selectVisible');

  elements.play.addEventListener('click', playSelection);
  elements.stop.addEventListener('click', () => stopAll(true));
  elements.clearSelection.addEventListener('click', clearSelection);
  elements.selectVisible.addEventListener('click', selectVisibleRecordings);

  renderCatalogue();
  updateMixer();
  setStatus('Toca numa vocalização para a ouvires imediatamente.');
})();