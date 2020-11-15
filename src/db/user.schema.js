const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Cart } = require('./cart.schema');
const { APIError } = require('../models/api-error.class');
const {
  USER_FN_MAX_LEN,
  USER_LN_MAX_LEN,
  USER_EMAIL_MAX_LEN,
  USER_PW_MIN_LEN,
  EMAIL_REG,
  PASSWORD_REG,
  OBJECT_ID_REG,
  ROLES
} = require('../utils/config');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'please add user\'s firstName'],
    trim: true,
    maxlength: [USER_FN_MAX_LEN, `firstName cannot be more than ${USER_FN_MAX_LEN}`]
  },
  lastName: {
    type: String,
    required: [true, 'please add user\'s lastName'],
    trim: true,
    maxlength: [USER_LN_MAX_LEN, `lastName cannot be more than ${USER_LN_MAX_LEN}`]
  },
  email: {
    type: String,
    required: [true, 'please add user\'s email'],
    trim: true,
    unique: true,
    maxlength: [USER_EMAIL_MAX_LEN, `email cannot be more than ${USER_EMAIL_MAX_LEN}`],
    match: [
      EMAIL_REG,
      'please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'please add user\'s password'],
    // password will be hashed. No need to check here
    // minlength: [USER_PW_MIN_LEN, `password should has at least ${USER_PW_MIN_LEN} character`],
    // match: [
    //   PASSWORD_REG,
    //   'Password must have at least one letter, one number, one special character & minimum 10 characters'
    // ],
    select: false
  },
  role: {
    type: String,
    enum: ROLES,
    required: [true, 'please add user\'s role']
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update && this._update.$set && this._update.$set.password) {
    this._update.$set.password = await bcrypt.hash(this._update.$set.password, 10);
  }
  next();
});

// Create a cart & attach to user after creating user
UserSchema.post('save', async function (next) {
  this.password = null;
  const cart = await new Cart({ user: this._id, items: [] }).save();
  delete cart.__v;
  this.cart = cart;
});

UserSchema.virtual('cart', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

const validator = Joi.object({
  _id: Joi.string().allow(null)
    .regex(OBJECT_ID_REG)
    .message('id of user should be a valid object id'),
  firstName: Joi.string().required().max(USER_FN_MAX_LEN),
  lastName: Joi.string().required().max(USER_LN_MAX_LEN),
  email: Joi.string().required().max(USER_EMAIL_MAX_LEN).email(),
  password: Joi.string().min(USER_PW_MIN_LEN)
    .regex(PASSWORD_REG)
    .message(`Password must have at least one letter, one number, one special character & minimum ${USER_PW_MIN_LEN} characters`),
  role: Joi.string().valid(...ROLES)
});

module.exports.validate = (user) => {
  const result = validator.validate(user);
  return result.error ? new APIError(result.error.details[0].message, 400, result.error) : null;
};

module.exports.User = mongoose.model('User', UserSchema);
