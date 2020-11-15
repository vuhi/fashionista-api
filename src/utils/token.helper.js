const jwt = require('jsonwebtoken');
const { PRIVATE_KEY, PUBLIC_KEY, TOKEN_AGO, TOKEN_EXPIRE, ISSUER, AUDIENCE } = require('./config');

const sign = (payload, email) => {
  if (!payload || !email) { throw new Error('cannot sign token: invalid arguments'); }
  const signOptions = {
    issuer: ISSUER,
    subject: email,
    audience: AUDIENCE,
    expiresIn: TOKEN_EXPIRE,
    algorithm: TOKEN_AGO
  };
  return jwt.sign(payload, PRIVATE_KEY, signOptions);
};

const verify = (token) => new Promise((resolve, reject) => {
  const verifyOptions = {
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: TOKEN_EXPIRE,
    algorithm: TOKEN_AGO
  };
  try {
    const payload = jwt.verify(token, PUBLIC_KEY, verifyOptions);
    if (!payload || !payload.id) { reject(new Error('an error occurred: malformed payload')); }
    resolve(payload.id);
  } catch (e) {
    reject(e);
  }
});

module.exports = { sign, verify };
