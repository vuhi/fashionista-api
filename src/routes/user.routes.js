const router = require('express').Router();
const { resFun } = require('../utils/res.helper');
const { authToken } = require('../middlewares/auth-token.middleware');
const { authRole } = require('../middlewares/auth-role.middleware');
const { isObjectNullOrEmpty, isObjectId } = require('../utils/func.helper');
const { APIError } = require('../models/api-error.class');
const { ADMIN } = require('../utils/config');
const userService = require('../services/user.service');

/**
 *  @path: [GET] api/users/me
 *  @desc: Get current user
 *  @auth: Login required
 */
router.get('/me', authToken, async (req, res) => {
  const { user } = req;
  // Need to populate Cart
  // const populate = { path: 'recipes', select: '_id' };
  // user.book = await bookService.getBook({ _id: user.book._id, createdBy: user._id }, populate);
  resFun(res, 'Success get user', user);
});

/**
 *  @path: [GET] api/users/all
 *  @desc: Get all users
 *  @auth: ADMIN
 */
router.get('/all', [authToken, authRole(ADMIN)], async (req, res, next) => {
  // TODO: FILTER OUT all ADMIN & SUPER_ADMIN role
  const users = await userService.getUsers();
  resFun(res, 'Success get users', users);
});

/**
 *  @path: [POST] api/users
 *  @desc: Create a user
 *  @auth: ADMIN
 */
router.post('', [authToken, authRole(ADMIN)], async (req, res, next) => {
  let user = req.body;
  if (isObjectNullOrEmpty(user)) {
    throw new APIError('payload empty', 400);
  }

  user = await userService.createUser({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role
  });

  resFun(res, 'Success create', user);
});

/**
 *  @path: [PUT] api/users/:id
 *  @desc: Update a user
 *  @auth: Login required
 */
router.put('/:id', authToken, async (req, res, next) => {
  let user = req.body;
  if (isObjectNullOrEmpty(user)) {
    throw new APIError('payload empty', 400);
  }

  const id = req.params.id;
  if (!isObjectId(id) || id !== user._id) {
    throw new APIError('invalid params', 400);
  }

  const update = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
  if (user.password) { update.password = user.password; }
  user = await userService.updateUser(id, update);
  resFun(res, 'Success update user', user);
});

/**
 *  @path: [DEL] api/users/:id
 *  @desc: Delete a user
 *  @auth: ADMIN only
 */
router.delete('/:id', [authToken, authRole(ADMIN)], async (req, res, next) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    throw new APIError('invalid params', 400);
  }
  const user = await userService.deleteUser(id);
  resFun(res, 'Success delete user', user);
});

module.exports = router;
