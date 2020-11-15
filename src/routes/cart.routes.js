const router = require('express').Router();
const { resFun } = require('../utils/res.helper');
const { authToken } = require('../middlewares/auth-token.middleware');
const { isObjectNullOrEmpty, isObjectId } = require('../utils/func.helper');
const { APIError } = require('../models/api-error.class');
const productService = require('../services/product.service');
const cartService = require('../services/cart.service');

/**
 *  @path: [PUT] api/carts/add/item
 *  @desc: Add an item to cart
 *  @auth: Login required
 */
router.put('/add/item', authToken, async (req, res, next) => {
  const { cartId, productId, quantity } = req.body;
  if (!cartId || !isObjectId(cartId) || !productId || !isObjectId(productId) || !quantity) {
    throw new APIError('invalid payload', 400);
  }

  const doesStockHasEnough = await productService.checkStock(productId, quantity);
  if (!doesStockHasEnough) {
    throw new APIError('stock does not have enough item, please reselect the quantity of the product');
  }

  const userId = req.user._id.toString();
  const condition = {
    $and: [
      { _id: cartId },
      { user: userId },
      {
        items: {
          $not: {
            $elemMatch: {
              product: productId
            }
          }
        }
      }
    ]
  };
  const item = { product: productId, quantity: quantity };
  const cart = await cartService.saveItemToCart(condition, item);
  resFun(res, 'Success update', cart);
});

/**
 *  @path: [PUT] api/carts/remove/item
 *  @desc: Remove a item from cart
 *  @auth: Login required
 */
router.put('/remove/item', authToken, async (req, res, next) => {
  const { cartId, productId, quantity } = req.body;
  if (!cartId || !isObjectId(cartId) || !productId || !isObjectId(productId) || !quantity) {
    throw new APIError('invalid payload', 400);
  }

  const userId = req.user._id.toString();
  const condition = {
    $and: [
      { _id: cartId },
      { user: userId },
      {
        items: {
          $elemMatch: {
            product: productId
          }
        }
      }
    ]
  };

  const item = { product: productId, quantity: quantity };
  const cart = await cartService.removeItemFromCart(condition, item);
  resFun(res, 'Success remove', cart);
});

/**
 *  @path: [PUT] api/carts/update/item/quantity
 *  @desc: Update item's quantity
 *  @auth: Login required
 */
router.put('/update/item/quantity', authToken, async (req, res, next) => {
  const { cartId, productId, quantity } = req.body;
  if (!cartId || !isObjectId(cartId) || !productId || !isObjectId(productId) || !quantity) {
    throw new APIError('invalid payload', 400);
  }

  const userId = req.user._id.toString();
  const condition = {
    $and: [
      { _id: cartId },
      { user: userId },
      {
        items: {
          $elemMatch: {
            product: productId
          }
        }
      }
    ]
  };

  const item = { product: productId, quantity: quantity };
  const cart = await cartService.updateItemQuantity(condition, item);
  resFun(res, 'Success update', cart);
});

/**
 *  @path: [PUT] api/carts/pay
 *  @desc: Pay & remove all items
 *  @auth: Login required
 */
router.put('/pay', authToken, async (req, res, next) => {
  const { cartId, items } = req.body;
  console.log(req.body);
  if (!cartId || !isObjectId(cartId) || !items.length) {
    throw new APIError('invalid payload', 400);
  }

  // TODO: Should check with items' stock before pay ...

  const userId = req.user._id.toString();
  const condition = {
    $and: [
      { _id: cartId },
      { user: userId }
    ]
  };
  const cart = await cartService.payCart(condition);
  await productService.updateProductsQuantity(items);
  resFun(res, 'Success make a payment', cart);
});

module.exports = router;
