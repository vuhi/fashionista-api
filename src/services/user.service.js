const { User, validate } = require('../db/user.schema');
const { APIError } = require('../models/api-error.class');

module.exports.getUsers = () => User.find().select('-__v');

module.exports.getUser = (id) => User.findById(id)
  .select('-__v')
  .populate({
    path: 'cart',
    select: '-__v',
    populate: { path: 'items.product', select: '-__v -description'}
  })
  .orFail(new APIError('no user found with the associated id', 404));

module.exports.getUserByIdentify = (loginIdentify) => User.findOne({ email: loginIdentify })
  .select('+password -__v')
  .orFail(new APIError('no user found with the associated identify', 401));

module.exports.createUser = (user) => {
  const error = validate(user);
  if (error) { throw error; }
  return new User(user).save();
};

module.exports.updateUser = (id, user) => {
  const error = validate(user);
  if (error) { throw error; }
  return User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true, runValidators: true })
    // .populate({ path: 'book', select: '_id recipes', populate: { path: 'recipes', select: '_id' } })
    .orFail(new APIError('failed to update, no result found with the associated id', 404));
};
module.exports.deleteUser = (id) => User.findByIdAndDelete(id)
  .orFail(new APIError('failed to delete, no result found with the associated id', 404));
