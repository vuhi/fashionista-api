const express = require('express');
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandlerFunc } = require('./middlewares/error-handler.middleware');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('dev'));

  // ROUTES
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/carts', cartRoutes);

  // GLOBAL ERROR HANDLER, SHOULD BE PLACE AT THE END
  app.use(errorHandlerFunc);
};
