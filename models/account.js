var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

// username, password, salt are added automatically by passport-local-mongoose plugin
var accountSchema = new Schema({
  fullname: String,
  createddate: {
    type: Date, 
    "default": Date.now
  },
  email: {
    type: String,
    unique: true,
    required: false
  },
  roles: [ String ],
  groups: [{
    group: String,
    ingerited: [ String ]
  }],
  locked: Boolean,
  lastLogin: Date
});

accountSchema.statics.findCoaches = function (cb) {
  return this.find({ roles: 'coach'}, cb);
};

accountSchema.plugin(passportLocalMongoose, {
  lastLoginField: 'lastLogon',
  attemptsField: 'attempts'
});

module.exports = mongoose.model('Account', accountSchema);
