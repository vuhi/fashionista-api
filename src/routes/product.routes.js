const router = require('express').Router();
const { resFun } = require('../utils/res.helper');
const { authToken } = require('../middlewares/auth-token.middleware');
const { authRole } = require('../middlewares/auth-role.middleware');
const { isObjectNullOrEmpty, isObjectId } = require('../utils/func.helper');
const { APIError } = require('../models/api-error.class');
const { ADMIN } = require('../utils/config');
const productService = require('../services/product.service');

/**
 *  @path: [GET] api/products/all
 *  @desc: Get all products with details
 *  @auth: ADMIN
 */
router.get('/all', [authToken, authRole(ADMIN)], async (req, res, next) => {
  const products = await productService.getDetailProducts();
  resFun(res, 'Success get', products);
});

/**
 *  @path: [GET] api/products/list
 *  @desc: Get all products but limit properties: _id name price image
 *  @auth: Login required
 */
router.get('/list', authToken, async (req, res, next) => {
  const products = await productService.getProducts();
  resFun(res, 'Success get', products);
});

/**
 *  @path: [GET] api/products/id
 *  @desc: Get a product with details
 *  @auth: Login required
 */
router.get('/:id', authToken, async (req, res, next) => {
  const { id } = req.params;
  const product = await productService.getProduct(id);
  resFun(res, 'Success get', product);
});

/**
 *  @path: [POST] api/products
 *  @desc: Create a product
 *  @auth: ADMIN
 */
router.post('', [authToken, authRole(ADMIN)], async (req, res, next) => {
  let product = req.body;
  if (isObjectNullOrEmpty(product)) {
    throw new APIError('payload empty', 400);
  }

  product = await productService.createProduct({
    name: product.name,
    image: product.image,
    brand: product.brand,
    description: product.description,
    price: product.price,
    quantity: product.quantity
  });

  resFun(res, 'Success create', product);
});

/**
 *  @path: [PUT] api/products/:id
 *  @desc: Update a product
 *  @auth: ADMIN
 */
router.put('/:id', [authToken, authRole(ADMIN)], async (req, res, next) => {
  let product = req.body;
  if (isObjectNullOrEmpty(product)) {
    throw new APIError('payload empty', 400);
  }

  const id = req.params.id;
  if (!isObjectId(id) || id !== product._id) {
    throw new APIError('invalid params', 400);
  }

  const update = {
    name: product.name,
    image: product.image,
    brand: product.brand,
    description: product.description,
    price: product.price,
    quantity: product.quantity
  };
  product = await productService.updateProduct(id, update);
  resFun(res, 'Success update', product);
});

/**
 *  @path: [DEL] api/products/:id
 *  @desc: Delete a product
 *  @auth: ADMIN
 */
router.delete('/:id', [authToken, authRole(ADMIN)], async (req, res, next) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    throw new APIError('invalid params', 400);
  }
  const product = await productService.deleteProduct(id);
  resFun(res, 'Success delete', product);
});

module.exports = router;
