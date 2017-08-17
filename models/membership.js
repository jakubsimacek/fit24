var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// username, password, salt are added automatically by passport-local-mongoose plugin
var Membership = new Schema({
  groups: [{
    name: String,
    desc: String,
  }],
  userMembership: [{
    userName: String,
    memberOf: [ String ]
  }],
  groupMembership: [{
    groupName: String,
    memberOf: [ String ]
  }]
});

// returns all group members as [String] of the group passed
function _getGroupMembers(self, group) {
  console.log('_getGroupMembers called with: ' + group);
  var groupItem = self.groupMembership.filter(gm => gm.groupName === group);
  if (groupItem.length === 1) {
    return groupItem[0].memberOf;
  }
  if (groupItem.length > 1) {
    console.log('Returned multiple items for ' + group);
  }
  return [];
}

// check if element is in [array]
function _checkElement(array, element) {
  return array.indexOf(element) !== -1;
}

// checks if adding childGroup to parentGroup a circular dependency gets created.
function _checkCircularDepend(self, parentGroup, childGroup) {
  console.log('d ');
  const members = _getGroupMembers(self, childGroup);
  if (_checkElement(self, members, parentGroup))
    return true;
  return members.some(memb => _checkCircularDepend(self, parentGroup, memb));
}

// check if the group is a member of any of the groups
function _checkMembership(self, group, groups) {
  console.log('_checkMembership called with: ' + group + '; ' + groups);
  if (groups.indexOf(group) != -1) {
    return true;
  }

  const members = _getGroupMembers(self, group);
  if (members.some(m => groups.indexOf(m) !== -1))
    return true;
  return members.some(m => _checkMembership(self, m, groups));
}

Membership.methods.isMemberOf = function (user, groups) {
  const self = this;
  if (typeof user !== 'string') {
      console.log('isMemberOf is passed a wrong value in user: ' + user + ' of type ' + typeof user);
      return false;
  }
  if (typeof groups === 'string')
    groups = [ groups ];
  else
    if (!(groups instanceof Array)) {
      console.log('isMemberOf is passed a wrong value in groups: ' + groups + ' of type ' + typeof groups);
      return { result: 'error', error: 'Wrong input parameter'};
    }

  const userGroups = self.userMembership.find(e => e.userName === user);
  if (!userGroups)
    return { result: 'error', error: 'User not found in the model membership' };
  if (userGroups.memberOf.some(e => groups.indexOf(e) !== -1))
    return  { result: 'found' };

  return userGroups.memberOf.find(
    g => _getGroupMembers(self, g).some(e => _checkMembership(self, e, groups))
  ) ? { result: 'found' } : { result: 'not-found' };
}

Membership.methods.addUser = function (user, group) {

}

Membership.methods.addGroup = function (parentGroup, childGroup) {
  if (_checkCircularDepend(parentGroup, childGroup))
    throw new Error('Circular dependency error');

}

function _getGroupTree(self, group) {
  var agroups = [];
  _getGroupMembers(self, group).forEach(g => { agroups = agroups.concat({group: g, memberOf: _getGroupTree(self, g)})});
  return agroups;
}

Membership.methods.getGroupTree = function (group) {
  return {
    group: group,
    memberOf: _getGroupTree(this, group)
  };
}

Membership.methods.getUserTree = function (user) {
  return {
    user: user,
    memberOf: _getGroupTree(this, group)
  };
}

function _getGroupGroups(self, group) {

}

Membership.methods.getGroupGroups = function (group) {
  return _getGroupGroups(this, group);
}

Membership.methods.getUserGroups = function (user) {
  const self = this;
  const userGroups = self.userMembership.find(e => e.userName === user);

}

module.exports = mongoose.model('Membership', Membership);

