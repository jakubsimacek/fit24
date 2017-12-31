const Account = require('../models/account')
const util = require('../util')

//////////////////////////////////////
// Utility functions
//////////////////////////////////////

function isOn(param) {
  return (param == "on") ? true : false
}

function contains(array, item) {
  return array.indexOf(item) > -1
}

function updateFixedRoles(roles, _isAdmin, _isCoach) {
      const isAdmin = isOn(_isAdmin)
      const isCoach = isOn(_isCoach)
      const wasAdmin = contains(roles, 'admin')
      const wasCoach = contains(roles, 'coach')

      if (isAdmin && !wasAdmin)
        roles.push('admin')
      else
          if (!isAdmin && wasAdmin)
            roles.splice(account.roles.indexOf('admin'), 1)

      if (isCoach && !wasCoach)
        roles.push('coach')
      else
        if (!isCoach && wasCoach)
          roles.splice(account.roles.indexOf('coach'), 1)
}

//////////////////////////////////////
// Controllers
//////////////////////////////////////

// now we allow anybody to register, TODO: move to admin zone
//router.get('/registrace', 
module.exports.getCreateUser = function(req, res) {
  console.log(req.query);
  if (req.query.error)
    res.render('adminEditAccount', {error: req.query.error,
                                    account : {},
                                    form: {
                                      urlSubmit: "/registrace",
                                      submitButtonValue: "Vytvor",
                                      isReadOnly: false
                                    }
});
  else
    res.render('adminEditAccount', { account : {}, 
                                    form: {
                                      urlSubmit: "/registrace",
                                      submitButtonValue: "Vytvor",
                                      isReadOnly: false
                                    }
                                  }
    )
}

//router.post('/registrace', 
module.exports.postCreateUser = function(req, res, next) {
  console.log('registering user');
  console.log(req.body.email);
  const roles = []
  const error = {}

  if (!req.body.username) {
    error.username = true    
  }
  if (!req.body.email) {
    error.email = true
  }
  if (!req.body.fullname) {
    error.fullname = true
  }
  if (!req.body.password || !req.body.password2 || req.body.password != req.body.password2) {
    error.password = true
  }
  if (error.username || error.email || error.fullname || error.password) {
    res.render('adminEditAccount', { account : {}, 
                                    form: {
                                      urlSubmit: "/registrace",
                                      submitButtonValue: "Vytvor",
                                      isReadOnly: false
                                    }
                                  }
    )

  }
  updateFixedRoles(roles, req.body.isAdmin, req.body.isCoach)

  Account.register(new Account({username: req.body.username, 
                                fullname: req.body.fullname, 
                                email: req.body.email, 
                                roles: roles
                              }), 
                   req.body.password, 
                   function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/admin/uzivatele');
  });
}


//router.get('/admin/uzivatel/:user/zmenit', ctrlAccounts.
module.exports.getUpdateUser = function (req, res) {
  const accId = req.params.user
  Account.findOne({ username : accId }, (err, account) => {
    if (err)
      util.renderr(res, 'Nemuzu najit uzivatele', err)
    else {
      console.log('admin account ' + account)
  
      res.render('adminEditAccount', {
                                         user: req.user, 
                                         account: {
                                           username: account.username,
                                           fullname: account.fullname,
                                           password: account.password,
                                           email: account.email,
                                           isAdmin: account.roles.indexOf('admin') > -1,
                                           isCoach: account.roles.indexOf('coach') > -1
                                         }, 
                                         form: { 
                                           urlSubmit: "/admin/uzivatel/" + accId + "/zmenit",
                                           submitButtonValue: "Uloz",
                                           isReadOnly: false
                                         }
                                       }
      )
    }
  })
}

//router.post('/admin/uzivatel/:user/zmenit', ctrlAccounts.
module.exports.postUpdateUser = function (req, res) {
  const accId = req.params.user
  Account.findOne({ username : accId }, (err, account) => {
    if (err)
      util.renderr(res, 'Nemuzu najit uzivatele', err)
    else {
      console.log('admin account ' + account)
      account.fullname = req.body.fullname
      account.email = req.body.email

      updateFixedRoles(account.roles, req.body.isAdmin, req.body.isCoach)

      account.save(function(err, updatedAccount) {
        if (err)
          util.renderr(res, 'Nemuzu ulozit uzivatele', err)
        else {
          res.redirect('/admin/uzivatele')
        }
      })
    }
  })  
}

//router.get('/admin/uzivatel/:user/kopie', ctrlAccounts.
module.exports.getCopyUser = function (req, res) {
  const accId = req.params.user
  Account.findOne({ username : accId }, (err, account) => {
    if (err)
      util.renderr(res, 'Nemuzu najit uzivatele', err)
    else {
      console.log('admin account ' + account)
  
      res.render('adminEditAccount', {
                                         user: req.user, 
                                         account: {
                                           username: "",
                                           fullname: "",
                                           password: "",
                                           email: "",
                                           isAdmin: account.roles.indexOf('admin') > -1,
                                           isCoach: account.roles.indexOf('coach') > -1
                                         },
                                         form: { 
                                           urlSubmit: "/admin/uzivatel/" + accId + "/kopie",
                                           submitButtonValue: "Vytvor",
                                           isReadOnly: false
                                         }
                                       }
      )
    }
  })
}

//router.post('/admin/uzivatel/:user/kopie', ctrlAccounts.
module.exports.postCopyUser = function (req, res) {
  const accId = req.params.user
  Account.findOne({ username : accId }, (err, account) => {
    if (err)
      util.renderr(res, 'Nemuzu najit uzivatele', err)
    else {
      console.log('admin account ' + account)
      account.fullname = req.body.fullname
      account.email = req.body.email
      const isAdmin = (req.body.isAdmin == "on") ? true : false
      const isCoach = (req.body.isCoach == "on") ? true : false
      const wasAdmin = account.roles.indexOf('admin') > -1
      const wasCoach = account.roles.indexOf('coach') > -1
      if (isAdmin && !wasAdmin)
        account.roles.push('admin')
      else {
        if (isCoach && !wasCoach)
          account.roles.push('coach')
        else {
          if (!isAdmin && wasAdmin)
            account.roles.splice(account.roles.indexOf('admin'), 1)
          else {
            if (!isCoach && wasCoach)
              account.roles.splice(account.roles.indexOf('coach'), 1)
          }
        }
      }


      account.save(function(err, updatedAccount) {
        if (err)
          util.renderr(res, 'Nemuzu ulozit uzivatele', err)
        else {
          res.redirect('/admin/uzivatele')
        }
      })
    }
  })  
}


//router.get('/admin/uzivatel/:user/odstranit', ctrlAccounts.
module.exports.getDeleteUser = function (req, res) {
  const accId = req.params.user
  Account.findOne({ username : accId }, (err, account) => {
    if (err)
      util.renderr(res, 'Nemuzu najit uzivatele', err)
    else {
      console.log('admin account ' + account)
  
      res.render('adminDeleteAccount', {
                                         user: req.user, 
                                         account: {
                                           username: account.username,
                                           fullname: account.fullname,
                                           //password: account.password,
                                           email: account.email,
                                           isAdmin: account.roles.indexOf('admin') > -1,
                                           isCoach: account.roles.indexOf('coach') > -1
                                         }, 
                                         urlSubmit: "/admin/uzivatel/" + accId + "/odstranit"
                                       }
      )
    }
  })
}

//router.post('/admin/uzivatel/:user/odstranit', ctrlAccounts.
module.exports.postDeleteUser = function (req, res) {
  const accId = req.params.user
  Account.findOne({ username : accId }, (err, account) => {
    if (err)
      util.renderr(res, 'Nemuzu najit uzivatele', err)
    else {
      console.log('admin account ' + account)

      account.remove(function(err, updatedAccount) {
        if (err)
          util.renderr(res, 'Nemuzu ulozit uzivatele', err)
        else {
          res.redirect('/admin/uzivatele')
        }
      })
    }
  })  
}

//router.get('/admin/uzivatele', ctrlAccounts.
module.exports.getUsers = function (req, res) {
  Account.find({}, (err, accounts) => {
    if (err)
      render('error', { user: req.user, error: err })
    else {
console.log('accounts:' + accounts)
      console.log('I\'m ' + req.user)
      const accountsEnr = accounts.map(a => {
        const isAdmin = a.roles.indexOf('admin') > -1
        const isCoach = a.roles.indexOf('coach') > -1
        const noRoles = a.roles.length
        const noGroups = a.groups.length

        return {
          username : a.username,
          fullname : a.fullname,
          createdDate : a.createddate,
          email : a.email,
          isAdmin : isAdmin,
          isCoach : isCoach,
          noRoles : noRoles,
          noGroups : noGroups,
          isLocked : a.isLocked,
          lastLogin : a.lastLogin,
          urlUpdate : "/admin/uzivatel/" + a.username + "/zmenit",
          urlDelete : "/admin/uzivatel/" + a.username + "/odstranit"
        }
      })
      const data = {
        urlUpdate : res.render('adminAccounts', {user: req.user, accounts: accountsEnr})
      }
    }
  })
}


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

