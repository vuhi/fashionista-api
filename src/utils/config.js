const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors/safe');

module.exports.initConfig = () => {
  try {
    console.log(colors.green('[SERVER]: initialize config, variables...'));
    dotenv.config({ path: './configs/config.env' });
    module.exports.PRIVATE_KEY = fs.readFileSync('./configs/private.key', 'utf8');
    module.exports.PUBLIC_KEY = fs.readFileSync('./configs/public.key', 'utf8');
    module.exports.PORT = process.env.PORT || 3000;
    module.exports.CONNECTION_STRING = process.env.CONNECTION_STRING;
    module.exports.TOKEN_AGO = process.env.TOKEN_AGO;
    module.exports.TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;
    module.exports.AUDIENCE = process.env.AUDIENCE;
    module.exports.ISSUER = process.env.ISSUER;
  } catch (err) {
    console.log(colors.red(`[SERVER]: setting secret failed: ${err.message}`));
    process.exit(1);
  }
};

module.exports.USER_FN_MAX_LEN = 50;
module.exports.USER_LN_MAX_LEN = 50;
module.exports.USER_EMAIL_MAX_LEN = 50;
module.exports.USER_PW_MIN_LEN = 10;

module.exports.PRODUCT_NAME_MAX_LEN = 50;
module.exports.IMG_URL_MAX_LEN = 500;
module.exports.PRODUCT_BRAND_MAX_LEN = 100;
module.exports.PRODUCT_DESC_MAX_LEN = 500;
module.exports.PRODUCT_PRICE_MIN = 0;
module.exports.PRODUCT_QUANTITY_MIN = 0;
module.exports.ITEM_QUANTITY_MIN = 1;

// eslint-disable-next-line no-useless-escape
module.exports.EMAIL_REG = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
module.exports.PASSWORD_REG = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
module.exports.OBJECT_ID_REG = /^[0-9a-fA-F]{24}$/;

module.exports.MONGO_ERROR = 'MongoError';
module.exports.MONGO_VALIDATION_ERROR = 'ValidationError';
module.exports.API_ERROR = 'APIError';

const USER = 'USER';
const ADMIN = 'ADMIN';
module.exports.USER = USER;
module.exports.ADMIN = ADMIN;
module.exports.ROLES = [USER, ADMIN];
