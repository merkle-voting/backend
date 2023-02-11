const express = require('express');

const dbclient = require('../../database/client');

const router = express.Router();

router.get('/:id/:address', async (req, res) => {
  const { id, address } = req.params;

  try {
    const db = await dbclient.connect('merkle');
    const proofCollection = db.collection(`proofs-${id}`);

    const options = {
      projection: {
        _id: 0,
        PROOF: 1,
      },
    };

    let cursor = proofCollection.find(
      {
        ELECTIONID: id,
        ADDRESS: address,
      },
      options
    );

    let proofs = [];
    await cursor.forEach((doc) => {
      proofs.push(...doc['PROOF']);
    });

    if (proofs.length <= 0) {
      return res.status(400).json({ success: false, message: 'No proof recorded' });
    }

    return res.status(200).json({ success: true, message: 'proofs fetched successfully', proofs });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    await dbclient.disconnect();
  }
});

module.exports = { ProofRouter: router };
