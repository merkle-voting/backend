const express = require('express');
const parse = require('csv-parse').parse;
const os = require('os');
const multer = require('multer');
const fs = require('fs');

const dbclient = require('../../database/client');
const { mapListOfListToListOfObjects } = require('../../utils/mapKeys');

const upload = multer({ dest: os.tmpdir() });

const router = express.Router();

router.post('/details', upload.single('file'), async (req, res) => {
  const file = req.file;
  const data = fs.readFileSync(file.path);
  parse(data, async (err, records) => {
    if (err) {
      console.error({ err });
      return res.status(400).json({ success: false, message: 'An error occured', meta: { err } });
    }

    try {
      const db = await dbclient.connect('merkle');
      const voters = db.collection('voters');
      /**
       * @type {{ "NAME" : string, "LGA" : string, "NIN" : string, "AGE" : string }[]}
       */
      const votersDetails = mapListOfListToListOfObjects(records);
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

router.use('*', (req, res) => {
  return res.status(404).json({ success: false, message: 'Unknown route' });
});

module.exports = {
  VotersRouter: router,
};
