const express = require('express');
const parse = require('csv-parse').parse;
const os = require('os');
const multer = require('multer');
const fs = require('fs');

const dbclient = require('../../database/client');
const { mapListOfListToListOfObjectsAndHash, doesCollectionExistInDb } = require('../../utils');

const upload = multer({ dest: os.tmpdir() });

const router = express.Router();

router.post('/details', upload.single('file'), async (req, res) => {
  /**
   * @type {string}
   */
  const nameOfElection = req.body.name;
  if (!nameOfElection || !nameOfElection.trim()) {
    return res.status(400).json({ success: false, message: 'Election name is compulsory' });
  }

  const file = req.file;
  const data = fs.readFileSync(file.path);
  parse(data, async (err, records) => {
    if (err) {
      console.error({ err });
      return res.status(400).json({ success: false, message: 'An error occured', meta: { err } });
    }

    try {
      // TODO add merkle to env
      const db = await dbclient.connect('merkle');

      const isElectionNameInExistence = await doesCollectionExistInDb(db, nameOfElection);

      if (isElectionNameInExistence) {
        return res.status(400).json({ success: false, message: 'Election name exists' });
      }

      const voters = db.collection(nameOfElection);
      /**
       * @type {{ "NAME" : string, "LGA" : string, "NIN" : string, "AGE" : string }[]}
       */
      const votersDetails = mapListOfListToListOfObjectsAndHash(records);
      const options = { ordered: true };
      const result = await voters.insertMany(votersDetails, options);
      console.log(`${result.insertedCount} document were inserted`);
      return res.status(200).json({ success: true, message: 'Records updated successfully' });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ success: false, message: 'Contact system admin' });
    } finally {
      await dbclient.disconnect();
    }
  });
});

router.get('/:id/:address', async (req, res) => {
  const { id, address } = req.params;

  try {
    const db = await dbclient.connect('merkle');
    const proofCollection = db.collection(`proofs-${id}`);
    const options = {
      projection: {
        _id: 0,
        PROOF: 1,
        HASH: 1,
      },
    };

    const cursor = await proofCollection.findOne(
      {
        ELECTIONID: id,
        ADDRESS: address,
      },
      options
    );

    console.log({ id, address });

    if (cursor === null) {
      return res.status(400).json({ success: false, message: 'No matching data' });
    }

    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: {
        hash: cursor.HASH,
        proofs: cursor.PROOF,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    await dbclient.disconnect();
  }
});

router.use('*', (req, res) => {
  return res.status(404).json({ success: false, message: 'Unknown route' });
});

module.exports = {
  VotersRouter: router,
};
