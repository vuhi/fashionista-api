const mongoose = require('mongoose');
const Joi = require('joi');
const { APIError } = require('../models/api-error.class');
const {
  PRODUCT_NAME_MAX_LEN,
  IMG_URL_MAX_LEN,
  PRODUCT_BRAND_MAX_LEN,
  PRODUCT_DESC_MAX_LEN,
  PRODUCT_PRICE_MIN,
  PRODUCT_QUANTITY_MIN,
  OBJECT_ID_REG
} = require('../utils/config');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `please add product's name`],
    trim: true,
    maxlength: [PRODUCT_NAME_MAX_LEN, `name cannot be more than ${PRODUCT_NAME_MAX_LEN}`]
  },
  image: {
    type: String,
    trim: true,
    required: [true, `please add product's image`],
    maxlength: [IMG_URL_MAX_LEN, `recipe's image cannot be more than ${IMG_URL_MAX_LEN}`],
    match: [
      // eslint-disable-next-line no-useless-escape
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'please use a valid URL with HTTP or HTTPS'
    ]
  },
  brand: {
    type: String,
    required: [true, `please add product's brand`],
    trim: true,
    maxlength: [PRODUCT_BRAND_MAX_LEN, `name cannot be more than ${PRODUCT_BRAND_MAX_LEN}`]
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: [PRODUCT_DESC_MAX_LEN, `recipe's description cannot be more than ${PRODUCT_DESC_MAX_LEN}`]
  },
  price: {
    type: Number,
    required: [true, `please add user's price`],
    min: [PRODUCT_PRICE_MIN, `price must be at least ${PRODUCT_PRICE_MIN}`]
  },
  quantity: {
    type: Number,
    required: [true, `please add user's quantity`],
    min: [PRODUCT_QUANTITY_MIN, `quantity must be at least ${PRODUCT_QUANTITY_MIN}`]
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const validator = Joi.object({
  _id: Joi.string().allow(null)
    .regex(OBJECT_ID_REG)
    .message('id of user should be a valid object id'),
  name: Joi.string().required().max(PRODUCT_NAME_MAX_LEN),
  image: Joi.string().required().max(IMG_URL_MAX_LEN).uri(),
  brand: Joi.string().required().max(PRODUCT_BRAND_MAX_LEN),
  description: Joi.string().required().max(PRODUCT_DESC_MAX_LEN),
  price: Joi.number().strict().required().min(PRODUCT_PRICE_MIN),
  quantity: Joi.number().integer().strict().required().min(PRODUCT_QUANTITY_MIN)
});

module.exports.validate = (product) => {
  const result = validator.validate(product);
  return result.error ? new APIError(result.error.details[0].message, 400, result.error) : null;
};

module.exports.Product = mongoose.model('Product', ProductSchema);
