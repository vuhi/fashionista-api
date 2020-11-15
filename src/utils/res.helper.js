module.exports.resFun = (res, message, data = null) => {
  res.status(200);
  res.json({
    status: 'Success',
    message: message,
    count: Array.isArray(data) ? data.length : null,
    data: data
  });
};
