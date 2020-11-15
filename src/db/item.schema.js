const mongoose = require('mongoose');
const Joi = require('joi');
const { APIError } = require('../models/api-error.class');
const { OBJECT_ID_REG, ITEM_QUANTITY_MIN } = require('../utils/config');

const ItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, `please add productId of the item in cart`]
  },
  quantity: {
    type: Number,
    required: [true, `please add number of item in cart`],
    min: [ITEM_QUANTITY_MIN, `item's quantity must be at least ${ITEM_QUANTITY_MIN}`]
  }
}, { _id: false });

const itemSchemaValidator = Joi.object({
  product: Joi.string().required().regex(OBJECT_ID_REG).message('productId of item should be a valid object id'),
  quantity: Joi.number().integer().required().min(1)
});

module.exports.validate = (item) => {
  const result = itemSchemaValidator.validate(item);
  return result.error ? new APIError(result.error.details[0].message, 400, result.error) : null;
};

module.exports.ItemSchema = ItemSchema;
module.exports.itemSchemaValidator = itemSchemaValidator;