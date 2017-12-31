//const CircularJSON = require('circular-json')

module.exports.renderr = function (res, message, error, data) {
  data = data || {};
  res.status(500);
  res.render('error', { message: message, error: error, data: data });
}


// helper function
module.exports.add = function (a, b) {
  return a + b;
}

// helper function
module.exports.min = function(date1, date2) {
  return new Date(Math.min(date1, date2))
}

// helper function
module.exports.max = function(date1, date2) {
  return new Date(Math.max(date1, date2))
}

