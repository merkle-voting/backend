const express = require('express');
const cors = require('cors');
const configs = require('./src/configs/run');
const routes = require('./src/routes');

function main() {
  configs.runConfigs();

  const app = express();

  app.use(cors());

  app.use('/voters', routes.VotersRouter);
  app.use('/elections', routes.ElectionRouter);
  app.use('/proof', routes.ProofRouter);
  app.use('/root', routes.RootRouter);
  app.use('/poll', routes.PollRouter);

  app.use('*', (req, res) => {
    return res.status(404).json({ success: false, message: 'Unknown route' });
  });

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`App listening on ${PORT} port`);
  });
}

main();
