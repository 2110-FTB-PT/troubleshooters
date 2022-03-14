const apiRouter = require('express').Router();

//JWT
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const router = require('./users');
const { JWT_SECRET } = process.env

apiRouter.get('/', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

//Authorization
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if(!auth){
    next();
  }else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try{
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id){
        const user = await getUserById(id);
        req.user = user;
        next();
      }
    } catch ({ name, message }) {
      next({ name, message })
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: 'Authorization token must start with ${prefix}'
    })
  }
});

// place your routers here
apiRouter.use('/users', require('./users'));

module.exports = apiRouter;