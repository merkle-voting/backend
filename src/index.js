const express = require('express');
const configs = require('./configs/run');
const routes = require('./routes');

function main() {
  configs.runConfigs();

  const app = express();

  app.use('/voters', routes.VotersRouter);

  app.listen(3000, () => {
    console.log('App listening on 3000 port');
  });
}

main();
