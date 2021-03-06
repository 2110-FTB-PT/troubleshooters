const apiRouter = require('express').Router();

//JWT
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env

apiRouter.get('/', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

//Authorization
apiRouter.use(async (req, res, next) => {
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
apiRouter.use('/orders', require('./orders'));
apiRouter.use('/reviews', require('./reviews'));
apiRouter.use('/order_products', require('./order_products'));
apiRouter.use('/products', require('./products'));
apiRouter.use('/product_categories', require('./product_categories'));
apiRouter.use('/categories', require ('./categories.js'))

//Error handling: 404 errors
apiRouter.use((req, res, next) => {
  res.status(404).send({
    message: "Page Not Found"
  });
});

module.exports = apiRouter;