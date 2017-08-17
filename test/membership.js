const Membership = require('../models/membership');

const model = { 
  groups: [{
    name: 'top',
    desc: 'Top'
  }, {
    name: 'coaches',
    desc: 'Fit 24 coaches'
  }, {
    name: 'fit24',
    desc: 'Fit24 members'
  }, {
    name: 'ndc',
    desc: 'NDC'
  }, {
    name: 'trip-org',
    desc: 'Trip organizers'
  }, {
    name: 'trip-20170325',
    desc: 'Sazava vylet 25.3.'
  }, {
    name: 'americka',
    desc: 'Americka supevizors'
  }, {
    name: 'americka-lead',
    desc: 'Americka leaders'
  }, {
    name: 'test',
    desc: 'test'
  }],
  userMembership: [{
    userName: 'jiri',
    memberOf: [ 'top', 'americka-lead' ]
  }, {
    userName: 'hanka',
    memberOf: [ 'top', 'americka-lead' ]
  }, {
    userName: 'marie',
    memberOf: [ 'top', 'fit24' ]
  }, {
    userName: 'ales',
    memberOf: [ 'ndc', 'americka', 'coaches' ]
  }, {
   userName: 'jakub',
   memberOf: [ 'ndc', 'americka', 'fit24' ]
  }, {
   userName: 'veronika',
   memberOf: [ 'americka', 'coaches', 'fit24', 'ndc', 'trip-20170325' ]
  }, {
   userName: 'ivana',
   memberOf: [ 'americka', 'coaches', 'ndc' ]
  }, {
   userName: 'tomas',
   memberOf: [ 'ndc', 'fit24', 'trip-organizers', 'trip-20170325' ]
  }, {
   userName: 'zuzka',
   memberOf: [ 'ndc', 'trip-20170325' ]
  }, {
   userName: 'zdenek',
   memberOf: [ 'fit24' ]
  }, {
   userName: 'testovic',
   memberOf: 'test'
  }],
  groupMembership: [{
    groupName: 'top',
    memberOf: [ 'ndc', 'trip-organizers' ]
  }, {
    groupName: 'coaches',
    memberOf: [ 'fit24', 'americka' ]
  }, {
    groupName: 'americka-lead',
    memberOf: [ 'americka' ]
  }, {
    groupName: 'test',
    memberOf: [ 'neexist', 'top', 'americka-lead' ]
  }]
}

const m = new Membership(model);
/*
console.log('1', m.isMemberOf('karel', [ 'ndc' ]));
console.log('1', m.isMemberOf('jakub', [ 'americka' ]));
console.log('1', m.isMemberOf('jakub', [ 'top', 'americka' ]));
console.log('1', m.isMemberOf('jakub', [ 'top' ]));
console.log('===============================');
*/
//console.log('1', m.isMemberOf('hanka', [ 'americka' ]));
//console.log('1', m.isMemberOf('testovic', [ 'americka' ]));

//console.log('getGroupTree: ', m.getGroupTree('test'));
console.log('getGroupTree:\n', JSON.stringify(m.getGroupTree('test'), null, 2));


