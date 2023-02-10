const VotersRouter = require('./voters').VotersRouter;
const ElectionRouter = require('./elections').ElectionRouter;
const ProofRouter = require('./proofs').ProofRouter;
const RootRouter = require('./root').RootRouter;

module.exports = {
  VotersRouter,
  ElectionRouter,
  ProofRouter,
  RootRouter,
};
