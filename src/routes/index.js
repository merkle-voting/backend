const VotersRouter = require('./voters').VotersRouter;
const ElectionRouter = require('./elections').ElectionRouter;
const ProofRouter = require('./proofs').ProofRouter;
const RootRouter = require('./root').RootRouter;
const PollRouter = require('./poll').PollRouter;

module.exports = {
  VotersRouter,
  ElectionRouter,
  ProofRouter,
  RootRouter,
  PollRouter,
};
