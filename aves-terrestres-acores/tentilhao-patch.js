'use strict';

(() => {
  const tentilhao = speciesLibrary.find((species) => species.id === 'tentilhao');
  if (!tentilhao) return;

  const newRecordings = [
    {
      id: '909663',
      type: 'Vocalização de alarme',
      sex: 'Macho',
      location: 'Açores',
      recordist: 'Consultar ficha do Xeno-canto'
    },
    {
      id: '483594',
      type: 'Vocalização',
      sex: 'Macho',
      location: 'Açores',
      recordist: 'Consultar ficha do Xeno-canto'
    }
  ];

  tentilhao.recordings = newRecordings;

  for (let index = recordings.length - 1; index >= 0; index -= 1) {
    if (recordings[index].speciesId === tentilhao.id) recordings.splice(index, 1);
  }

  newRecordings.forEach((recording) => {
    recordings.push({
      ...recording,
      speciesId: tentilhao.id,
      speciesName: tentilhao.name
    });
  });

  renderFilterChips(elements.sexFilters, uniqueSorted(recordings.map((item) => item.sex)), 'sex');
  renderFilterChips(elements.typeFilters, uniqueSorted(recordings.map((item) => item.type)), 'type');
  renderCatalogue();
  updateMixer();
})();
