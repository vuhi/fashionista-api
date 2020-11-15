const express = require('express');
const colors = require('colors/safe');
// eslint-disable-next-line import/newline-after-import
const config = require('./utils/config');
config.initConfig();

const app = express();
// SET UP ROUTES
require('./routes')(app);
// SET UP DB CONNECTION
require('./db/db.connection')(config.CONNECTION_STRING);

app.listen(config.PORT, () =>
  console.log(colors.yellow(`[SERVER]: Server running in [${process.env.NODE_ENV}] mode on port: ${config.PORT}`))
);
