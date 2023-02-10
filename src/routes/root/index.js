const express = require('express');
const dbclient = require('../../database/client');

const router = express.Router();

router.get('/:name/:id', async (req, res) => {
  const { name, id } = req.params;

  try {
    const db = await dbclient.connect('merkle');
    const rootCollection = db.collection('trees');

    const options = {
      projection: {
        _id: 0,
        value: 1,
      },
    };

    const query = `${name}-${id}`;
    let cursor = await rootCollection.findOne({ name: query }, options);

    if (cursor === null) {
      return res.status(400).json({ success: false, message: 'No root' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Root retrieved successfully', root: cursor.value });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    await dbclient.disconnect();
  }
});

module.exports = { RootRouter: router };