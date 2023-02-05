const express = require('express');
const configs = require('./src/configs/run');
const routes = require('./src/routes');

function main() {
  configs.runConfigs();

  const app = express();

  app.use('/voters', routes.VotersRouter);
  app.use('/elections', routes.ElectionRouter);

  app.use('*', (req, res) => {
    return res.status(404).json({ success: false, message: 'Unknown route' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`App listening on ${PORT} port`);
  });
}

main();
