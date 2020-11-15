const { Product, validate } = require('../db/product.schema');
const { APIError } = require('../models/api-error.class');

module.exports.getDetailProducts = () => Product.find().select('-__v');

module.exports.getProducts = () => Product.find().select('_id name price image');

module.exports.getProduct = (id) => Product.findById(id)
  .select('-__v')
  // .populate({ path: 'book', select: '_id' })
  .orFail(new APIError('no product found with the associated id', 404));

module.exports.checkStock = async (id, quantity) => {
  const product = await Product.findById(id).select('quantity')
    .orFail(new APIError('no product found with the associated id', 404));
  return product.quantity >= quantity;
};

module.exports.createProduct = (product) => {
  const error = validate(product);
  if (error) { throw error; }
  return new Product(product).save();
};

module.exports.updateProduct = (id, product) => {
  const error = validate(product);
  if (error) { throw error; }
  return Product.findOneAndUpdate({ _id: id }, { $set: product }, { new: true, runValidators: true })
    // .populate({ path: 'book', select: '_id recipes', populate: { path: 'recipes', select: '_id' } })
    .orFail(new APIError('failed to update, no result found with the associated id', 404));
};

// module.exports.updateProductsQuantity = (items) => {
//   console.log(items);
//   const bulkOperation = Product.collection.initializeUnorderedBulkOp();
//   items.forEach((item) => {
//     bulkOperation.find({ _id: item.product }).update({
//       $inc: { quantity: -(+item.quantity) }
//     });
//   });
//   return bulkOperation.execute();
//   // return Product.findOneAndUpdate({ _id: id }, { $set: { quantity: quantity } }, { new: true, runValidators: true })
//   //   .orFail(new APIError('failed to update, no result found with the associated id', 404));
// };

module.exports.updateProductsQuantity = (items) => {
  const promises = items.map((item) =>
    Product.findOneAndUpdate({ _id: item.product }, { $inc: { quantity: -(+item.quantity) } }, { new: true, runValidators: true })
      .orFail(new APIError(`failed to update quantity of ${item.product}, no result found with the associated id`, 404)));
  return Promise.all([...promises]).then();
};

module.exports.deleteProduct = (id) => Product.findByIdAndDelete(id)
  .orFail(new APIError('failed to delete, no result found with the associated id', 404));
