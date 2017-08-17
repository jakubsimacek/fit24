var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// username, password, salt are added automatically by passport-local-mongoose plugin
var Role = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  desc: String
});


module.exports = mongoose.model('Role', Role);
