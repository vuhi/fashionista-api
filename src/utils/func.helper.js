const { OBJECT_ID_REG } = require('./config');

module.exports.isObjectNullOrEmpty = (obj) => {
  return obj === null || obj === undefined || Object.getOwnPropertyNames(obj).length === 0;
};

module.exports.isObjectId = (id) => {
  const regExp = new RegExp(OBJECT_ID_REG);
  return !(id === null || id === undefined || id === '' || !regExp.test(id));
};
