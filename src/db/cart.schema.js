const mongoose = require('mongoose');
const Joi = require('joi');
const { APIError } = require('../models/api-error.class');
const { OBJECT_ID_REG } = require('../utils/config');
const { ItemSchema, itemSchemaValidator } = require('./item.schema');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, `please add user that cart belongs to`]
  },
  items: {
    type: [ItemSchema],
    default: []
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const validator = Joi.object({
  _id: Joi.string().allow(null)
    .regex(OBJECT_ID_REG)
    .message('id of user should be a valid object id'),
  user: Joi.string().required().regex(OBJECT_ID_REG).message('user of cart should be a valid object id'),
  items: Joi.array().items(itemSchemaValidator)
});

module.exports.validate = (product) => {
  const result = validator.validate(product);
  return result.error ? new APIError(result.error.details[0].message, 400, result.error) : null;
};

module.exports.Cart = mongoose.model('Cart', CartSchema);
