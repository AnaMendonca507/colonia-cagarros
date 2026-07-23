'use strict';

(() => {
  const priolo = speciesLibrary.find((species) => species.id === 'priolo');
  if (!priolo) return;

  const recording = {
    id: '350481',
    type: 'Vocalização',
    sex: 'Não indicado',
    location: 'São Miguel, Açores',
    recordist: 'Consultar ficha do Xeno-canto'
  };

  delete priolo.pending;
  priolo.recordings = [recording];

  if (!recordings.some((item) => item.id === recording.id)) {
    recordings.push({
      ...recording,
      speciesId: priolo.id,
      speciesName: priolo.name
    });
  }

  renderFilterChips(elements.sexFilters, uniqueSorted(recordings.map((item) => item.sex)), 'sex');
  renderFilterChips(elements.typeFilters, uniqueSorted(recordings.map((item) => item.type)), 'type');
  renderCatalogue();
  updateMixer();
})();
