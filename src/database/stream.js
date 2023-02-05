const { Collection, ChangeStream } = require('mongodb');

/**
 *
 * @param {number} timeInMS
 * @param {ChangeStream<import('mongodb').Document, import('mongodb').ChangeStreamDocument<import('mongodb').Document>>} changeStream
 * @returns
 */
function closeChangeStream(timeInMS = 6000, changeStream) {
  return new Promise((resolve) => {
    setTimeout(() => {
      changeStream.close();
      resolve();
    }, timeInMS);
  });
}

/**
 *
 * @param {Collection<import('mongodb').Document>} collection
 * @param {number} timeInMs
 * @param {[]} pipeline
 */

async function monitorCollectionUsingEventEmitter(collection, timeInMs = 60000, pipeline = []) {
  console.log('monitoring');
  const changeStream = collection.watch(pipeline);
  changeStream.on('change', (next) => {
    console.log({ next });
  });
  // await closeChangeStream(timeInMs, changeStream);
}

module.exports = {
  monitorCollectionUsingEventEmitter,
};
