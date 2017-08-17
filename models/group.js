var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// username, password, salt are added automatically by passport-local-mongoose plugin
var Group = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  memberships: [{
    group: String,
    direct: Boolean,
  }],
  roles: [ String ]
});


module.exports = mongoose.model('Group', Group);
