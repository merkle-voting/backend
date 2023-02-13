const express = require('express');
const bodyParser = require('body-parser');

const dbclient = require('../../database/client');
const { validateVoteData } = require('../../middlewares/poll');

const router = express.Router();

router.use(bodyParser.json());

router.post('/:id', validateVoteData, async (req, res) => {
  const { id } = req.params;

  const data = req.body;
  try {
    const db = await dbclient.connect('merkle');
    const pollCollection = db.collection(`poll-${id}`);
    const insertOption = { ordered: true };
    await pollCollection.insertMany(data, insertOption);
    return res.status(200).json({
      success: true,
      message: 'Poll updated',
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    await dbclient.disconnect();
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await dbclient.connect('merkle');
    const pollCollection = db.collection(`poll-${id}`);

    const options = {
      projection: {
        _id: 0,
      },
    };

    const result = await pollCollection.find({}, options).toArray();

    return res.status(200).json({
      success: true,
      message: 'Poll retrieved',
      available_data: result.length,
      poll: result,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    await dbclient.disconnect();
  }
});

module.exports = {
  PollRouter: router,
};
