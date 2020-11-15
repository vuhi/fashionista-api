const { Cart } = require('../db/cart.schema');
const { validate } = require('../db/item.schema');
const { APIError } = require('../models/api-error.class');

module.exports.updateItemQuantity = (condition, item) => {
  const error = validate(item);
  if (error) { throw error; }
  return Cart
    .findOneAndUpdate(condition, { $set: { 'items.$.quantity': item.quantity } }, { new: true, runValidators: true })
    .select('-__v')
    .populate({ path: 'items.product', select: '-__v'})
    .orFail(new APIError('failed to add a item to cart: item is already removed', 404));
};

module.exports.removeItemFromCart = (condition, item) => {
  const error = validate(item);
  if (error) { throw error; }
  return Cart
    .findOneAndUpdate(condition, { $pull: { items: item } }, { new: true, runValidators: true })
    .select('-__v')
    .populate({ path: 'items.product', select: '-__v'})
    .orFail(new APIError('failed to add a item to cart: item is already removed', 404));
};

module.exports.saveItemToCart = (condition, item) => {
  const error = validate(item);
  if (error) { throw error; }
  return Cart
    .findOneAndUpdate(condition, { $push: { items: item } }, { new: true, runValidators: true })
    .select('-__v')
    .populate({ path: 'items.product', select: '-__v'})
    .orFail(new APIError('failed to add a item to cart: item is already in cart', 404));
};

module.exports.payCart = (condition) => Cart
  .findOneAndUpdate(condition, { $set: { items: [] } }, { new: true, runValidators: true })
  .select('-__v')
  .populate({ path: 'items.product', select: '-__v'})
  .orFail(new APIError('failed to make a payment for current cart', 404));
