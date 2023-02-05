const ethers = require('ethers');
const { Db } = require('mongodb');

/**
 *
 * @param {[][]} data
 */
function mapListOfListToListOfObjectsAndHash(data) {
  const firstRow = data[0];
  const columnLength = firstRow.length;
  const dataLength = data.length;

  const objArray = [];

  for (let index = 1; index < dataLength; index++) {
    const row = data[index];
    const obj = {};

    for (let subIndex = 0; subIndex < columnLength; subIndex++) {
      /**
       * @type {string}
       */
      let title = firstRow[subIndex];
      title = title.toUpperCase();

      obj[title] = row[subIndex];
    }

    const hash = ethers.utils.solidityKeccak256(
      ['address', 'string', 'string', 'uint256', 'uint256'],
      [obj['ADDRESS'], obj['NAME'], obj['LGA'], obj['NIN'], obj['AGE']]
    );
    obj['HASH'] = hash;
    objArray.push(obj);
  }

  return objArray;
}

/**
 * Checks if a collection exists in a mongo database.
 *
 * @param db {Db}
 *    a mongo db object.  eg.
 *    client = await MongoClient.connect(uri);
 *    db = client.db();
 * @param collectionName the name of the collection to search for
 * @returns {Promise<boolean>}
 */
async function doesCollectionExistInDb(db, collectionName) {
  const collections = await db.collections();
  return collections.some((collection) => collection.collectionName === collectionName);
}

module.exports = {
  mapListOfListToListOfObjectsAndHash,
  doesCollectionExistInDb,
};
