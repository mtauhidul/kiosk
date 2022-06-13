export function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
export function addDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export const checkduplicity = (arrayData) => {
  const itemsData = arrayData.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arrayData.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  return itemsData;
};
export function toJSON(elements) {
  if (!elements) {
    return;
  }
  const downloadLink = document.createElement('a');
  const fileBlob = new Blob([JSON.stringify(elements, null, 2)], {
    type: 'application/json',
  });
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = 'kiosk_data_structure' + Math.random() + '.json';
  downloadLink.click();
}
