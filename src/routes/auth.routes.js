const router = require('express').Router();
const bcrypt = require('bcrypt');

const userService = require('../services/user.service');
const { sign } = require('../utils/token.helper');
const { resFun } = require('../utils/res.helper');
const { isObjectNullOrEmpty } = require('../utils/func.helper');
const { APIError } = require('../models/api-error.class');
const { USER, ADMIN } = require('../utils/config');
/**
 *  @path: [POST] api/auth/login
 *  @desc: Authenticate user with username or email & password
 */
router.post('/login', async (req, res, next) => {
  const { identify, password } = req.body;
  if (!identify || !password) {
    throw new APIError('missing payload', 401);
  }

  const user = await userService.getUserByIdentify(identify);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) { throw new APIError('invalid credential', 401); }

  const token = sign({ id: user._id }, user.email);
  resFun(res, 'Success login in', { token });
});

/**
 *  @path: [POST] api/auth/register
 *  @desc: Register a user
 */
router.post('/register', async (req, res, next) => {
  let user = req.body;
  if (isObjectNullOrEmpty(user)) {
    throw new APIError('payload empty', 400);
  }

  const xSecret = req.header('X-Secret');
  const secret = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKA50Q6IhE70JcYGck8BuNCG9';

  user = await userService.createUser({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: xSecret === secret ? ADMIN : USER
  });

  const token = sign({ id: user._id }, user.email);
  resFun(res, 'Success register', { token });
});

module.exports = router;
