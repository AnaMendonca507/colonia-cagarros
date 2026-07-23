'use strict';

(() => {
  const toutinegra = speciesLibrary.find((species) => species.id === 'toutinegra');
  if (!toutinegra) return;

  const newRecordings = [
    {
      id: '599016',
      type: 'Alarme',
      sex: 'Não indicado',
      location: 'Açores',
      recordist: 'Consultar ficha do Xeno-canto'
    },
    {
      id: '798749',
      type: 'Canto',
      sex: 'Não indicado',
      location: 'Açores',
      recordist: 'Consultar ficha do Xeno-canto'
    }
  ];

  toutinegra.recordings = newRecordings;

  for (let index = recordings.length - 1; index >= 0; index -= 1) {
    if (recordings[index].speciesId === toutinegra.id) recordings.splice(index, 1);
  }

  newRecordings.forEach((recording) => {
    recordings.push({
      ...recording,
      speciesId: toutinegra.id,
      speciesName: toutinegra.name
    });
  });

  renderFilterChips(elements.sexFilters, uniqueSorted(recordings.map((item) => item.sex)), 'sex');
  renderFilterChips(elements.typeFilters, uniqueSorted(recordings.map((item) => item.type)), 'type');
  renderCatalogue();
  updateMixer();
})();
