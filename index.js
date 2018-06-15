
'use strict';

const PORT = process.env.PORT || 3000;

let express = require('express');

let log = require('bunyan').createLogger({
  name: 'api-server',
  streams: [{ level: 'DEBUG', stream: process.stdout }]
});

let apiRouter = require('./lib/router');

express()
  .use('/api', (req, res, next) => {
    log.debug(`${req.method} ${req.url}`);
    next();
  })
  .use('/api', apiRouter)
  .listen(process.env.PORT || 3000, () => {
    log.info(`Server is listening on http://localhost:${PORT}`);
  });
