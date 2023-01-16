const express = require('express');
const configs = require('./configs/run');

configs.runConfigs();
const app = express();

app.use('/', (req, res) => {
  res.status(200).json('App Connected Successfully');
});

app.listen(3000, () => {
  console.log('App listening on 3000 port');
});
