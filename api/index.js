const apiRouter = require('express').Router();

apiRouter.get('/', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here

module.exports = apiRouter;