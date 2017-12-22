const CircularJSON = require('circular-json')

module.exports.renderr = function (res, message, error, data) {
  data = data || {};
  res.status(500);
  res.render('error', { message: message, error: error, data: data });
}


