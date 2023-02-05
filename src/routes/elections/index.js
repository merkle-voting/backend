const express = require('express');
const merkleTree = require('merkletreejs');
const bodyParser = require('body-parser');
const ethers = require('ethers');
const { body, validationResult } = require('express-validator');

const dbclient = require('../../database/client');
const { doesCollectionExistInDb } = require('../../utils');
const { Collection, Db } = require('mongodb');
const { monitorCollectionUsingEventEmitter } = require('../../database/stream');

/**
 * @typedef {{ election_name : string, election_id : string }} AddIDPayload
 */

/**
 * @typedef {{ leaf : string; address : string; proof : string[] }} AddressProof
 */

const router = express.Router();

router.use(bodyParser.json());

//This should probably be a cron job

/**
 *
 * @param {Collection<import('mongodb').Document>} collection
 */
const generateMerkleTree = async (collection) => {
  /**
   * @type {string[]}
   */

  const options = {
    projection: { _id: 0, ADDRESS: 1, HASH: 1, ELECTIONID: 1 },
  };

  let cursor = collection.find({}, options);

  const leaves = [];

  await cursor.forEach((doc) => {
    let leaf = ethers.utils.solidityKeccak256(
      ['address', 'bytes32', 'uint256'],
      [doc['ADDRESS'], doc['HASH'], doc['ELECTIONID']]
    );
    leaves.push(leaf);
  });

  const tree = new merkleTree.MerkleTree(leaves, ethers.utils.keccak256, { sortPairs: true });
  /**
   * @type {AddressProof[]}
   */
  const addressProofs = [];

  cursor = collection.find({}, options);

  await cursor.map((doc) => doc);
  const documents = await cursor.toArray();

  documents.forEach((doc, index) => {
    const leaf = leaves[index];
    // console.log({ leaf, doc });
    const proof = tree.getProof(leaf);
    addressProofs.push({
      leaf: '0x' + leaves[index].toString(),
      proof: proof.map((p) => '0x' + p.data.toString('hex')),
      address: doc['ADDRESS'],
    });
  });

  return addressProofs;
};

/**
 *
 * @param {Db} db
 */

const generateMerkleCollection = (db) => {
  try {
  } catch (error) {}
};

router.put('/add-id', async (req, res) => {
  /**
   * @type AddIDPayload
   */
  const data = req.body;

  if (!data.election_name || !data.election_name.trim()) {
    return res.status(400).json({ success: false, message: 'election_name cannot be empty' });
  }

  if (!data.election_id || !data.election_id.trim()) {
    return res.status(400).json({ success: false, message: 'election_id cannot be empty' });
  }

  try {
    //TODO add merkle to env

    const db = await dbclient.connect('merkle');
    const isElectionNameInExistence = await doesCollectionExistInDb(db, data.election_name);
    if (!isElectionNameInExistence) {
      return res.status(400).json({ success: false, message: 'Election name does not exist' });
    }

    const votersCollection = db.collection(data.election_name);
    const merkleCollection = db.collection(`${data.election_name}-${data.election_id}`);
    const merkleCollectionInsertOptions = { ordered: true };

    const result = await votersCollection.updateMany({}, { $set: { ELECTIONID: data.election_id } });
    console.log({ result });
    const addressProofs = await generateMerkleTree(votersCollection);

    merkleCollection.insertMany(addressProofs, merkleCollectionInsertOptions);

    return res.status(200).json({ success: true, message: 'Election ID successfully added' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ success: false, message: 'Contact system admin' });
  } finally {
    // await dbclient.disconnect();
  }
});

router.use('*', (req, res) => {
  console.log('Elections -> Unknown route');
  return res.status(404).json({ success: false, message: 'Unknown route' });
});

module.exports = {
  ElectionRouter: router,
};
