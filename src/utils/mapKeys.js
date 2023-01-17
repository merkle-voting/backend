/**
 *
 * @param {[][]} data
 */
function mapListOfListToListOfObjects(data) {
  const firstRow = data[0];
  const columnLength = firstRow.length;
  const dataLength = data.length;

  const objArray = [];

  for (let index = 1; index < dataLength; index++) {
    const row = data[index];
    const obj = {};

    for (let subIndex = 0; subIndex < columnLength; subIndex++) {
      const title = firstRow[subIndex];
      obj[title] = row[subIndex];
    }
    objArray.push(obj);
  }

  return objArray;
}

module.exports = {
  mapListOfListToListOfObjects,
};
