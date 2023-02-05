const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

/**
 * @typedef {{signature : string; candidateId : string; voter : string; voterHash : string; proof : string[]}} Payload
 */

router.post('/:election', async (req, res) => {
  const { election_id } = req.params;

  /**
   * @type Payload
   */
  const data = req.body;

  try {
  } catch (error) {}
});
