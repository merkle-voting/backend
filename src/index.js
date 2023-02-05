const express = require('express');
const configs = require('./configs/run');
const routes = require('./routes');

function main() {
  configs.runConfigs();

  const app = express();

  app.use('/voters', routes.VotersRouter);
  app.use('/elections', routes.ElectionRouter);

  // app.use('*', (req, res) => {
  //   return res.status(404).json({ success: false, message: 'Unknown route' });
  // });

  app.listen(3000, () => {
    console.log('App listening on 3000 port');
  });
}

main();
