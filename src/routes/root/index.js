const express = require('express');
const dbclient = require('../../database/client');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await dbclient.connect('merkle');
    const rootCollection = db.collection('trees');

    const options = {
      projection: {
        _id: 0,
        value: 1,
      },
    };

    const query = `proofs-${id}`;
    let cursor = await rootCollection.findOne({ name: query }, options);

    if (cursor === null) {
      return res.status(400).json({ success: false, message: 'No root' });
    }

    const cursorValue = await cursor.value;

    return res.status(200).json({ success: true, message: 'Root retrieved successfully', root: cursorValue });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    await dbclient.disconnect();
  }
});

module.exports = { RootRouter: router };
