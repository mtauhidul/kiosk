export const arrangeListOfItems = (previousData, updatedData) => {
  let newDataList = [];
  if (updatedData) {
    newDataList = [...previousData, ...updatedData];
  }

  return [...new Set(newDataList)];
};
