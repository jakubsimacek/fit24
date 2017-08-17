//mongoose = require('mongoose');

//router.get('/admin/skupina/:group', ctrlAccounts.
module.exports.getGroup = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/skupina/:group/manage', ctrlAccounts.
module.exports.getChangeGroupMembers = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/skupina/:group/manage', ctrlAccounts.
module.exports.postChangeGroupMembers = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/skupina/:group/clenstvi', ctrlAccounts.
module.exports.getGroupMembership = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/skupina/:group/strom', ctrlAccounts.
module.exports.getGroupTree = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/uzivatel/:user/clenstvi', ctrlAccounts.
module.exports.getUserMembership = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/uzivatel/:user/strom', ctrlAccounts.
module.exports.getUserTree = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/skupina/:group/je/clenem', ctrlAccounts.
module.exports.getGroupIsMemberOf = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/uzivatel/:user/blokovat', ctrlAccounts.
module.exports.getDisableUser = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/uzivatel/:user/blokovat', ctrlAccounts.
module.exports.postDisableUser = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/uzivatel/:user/odblokovat', ctrlAccounts.
module.exports.getEnableUser = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/uzivatel/:user/odblokovat', ctrlAccounts.
module.exports.postEnableUser = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/uzivatel/:user/odstranit', ctrlAccounts.
module.exports.getDeleteUser = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/uzivatel/:user/odstranit', ctrlAccounts.
module.exports.postDeleteUser = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/uzivatele', ctrlAccounts.
module.exports.getUsers = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/skupiny', ctrlAccount.
module.exports.getCreateGroup = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/skupiny/nova', ctrlAccount.
module.exports.getNewGroup = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/skupiny/nova', ctrlAccount.
module.exports.postNewGroup = function (req, res) {

  res.render('not-impl', {user: req.user});
}


module.exports.postLogin = function (req, res) {
  //console.log('login ctrl');
  //console.log(req.user);
  //req.user.lastLogin = new Date();
  //req.user.email = 'e@m.l';
  //req.user.save(function(err) {
    //console.log(err);
  //});
  res.redirect('/');
}

