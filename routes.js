var passport = require('passport');
var Account = require('./models/account');
var router = require('express').Router();
const ctrlAccount = require('./ctrls/account');
const ctrlWeek = require('./ctrls/week');
const ctrlForum = require('./ctrls/forum');

// main view - display week - if not logged in, redirect to login screen
// TODO: if you are not a member of fit24 group, redirect to forums
router.get('/', function(req, res) {
  if (!req.user) {
    res.redirect('/prihlaseni');
  }
  else {
    //res.render('index', {user: req.user});
    if (req.user.roles && req.user.roles.indexOf('coach') > -1)
      res.redirect('/admin/tydny');
    else
      res.redirect('/cviceni');
  }
});

// now we allow anybody to register, TODO: move to admin zone
router.get('/registrace', function(req, res) {
  console.log(req.query);
  if (req.query.error)
    res.render('register', {error: req.query.error});
  else
    res.render('register', {});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  console.log(req.body.email);
  let roles = [];
  if (!req.body.email) {
    res.redirect('/registrace?error=email');
    return;
  }
  if (req.body.admin === "on") roles.push('admin');
  if (req.body.coach === "on") roles.push('coach');
  Account.register(new Account({username: req.body.username, email: req.body.email, roles: roles}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/prihlaseni', function(req, res) {
  res.render('login', {user: req.user});
});

router.post('/prihlaseni', passport.authenticate('local'), ctrlAccount.postLogin);

// AUTENTICATED ZONE: beyond this point we allow only logged users
router.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/prihlaseni');
  }
  else {
    next();  // User found so continue to routes
  }
});

router.get('/odhlaseni', function(req, res) {
  req.logout();
  res.redirect('/');
});

// list forums (zatim bez slozek)
router.get('/fora', ctrlForum.getForums);

// list messages - hlavni router pro forum
router.get('/forum/:forum', ctrlForum.getForum);

// post message
//router.get('', ctrl); // ??? toto je ze seznamu zprav
router.post('/forum/:forum/nova_zprava', ctrlForum.postPost);

// edit message
router.get('/forum/:forum/zprava/:post/uprava', ctrlForum.getEditPost); // Docasne - pak in-page editace
router.post('/forum/:forum/zprava/:post/uprava', ctrlForum.postEditPost);

// list weeks
router.get('/cviceni/tydny', ctrlWeek.getWeeks);

// display current week
router.get('/cviceni', ctrlWeek.getCurrentWeek);

// display a week
router.get('/cviceni/:week', ctrlWeek.getWeek);
//router.get('/cviceni/:dd/:mm/:yyyy', ctrlWeekCurrentDMYY);  // zbytecne asi takhle

// book term
//router.get('/cviceni/:week/termin/:term/rezervuj', ctrlWeek.getBookTerm);   // toto je z hlavniho pohledu
//router.post('/cviceni/:week/termin/:term/rezervuj', ctrlWeek.postBookTerm);

// reserve term
//router.get('/cviceni/:term/poradnik', ctrlWeek.);   // toto je z hlavniho pohledu
//router.post('/cviceni/:term/poradnik', ctrlWeek.);

// cancel booking
//router.get('/cviceni/:week/termin/:term/zrus/rezervaci', ctrlWeek.);   // toto je z hlavniho pohledu
//router.post('/cviceni/:week/termin/:term/zrus/rezervaci', ctrlWeek.);

// cancel reservation
//router.get('/cviceni/:week/termin/:term/zrus/poradnik', ctrlWeek.);   // toto je z hlavniho pohledu
//router.post('/cviceni/:week/termin/:term/zrus/poradnik', ctrlWeek.);

// obsluha udalosti z hlavniho pohledu cviceni - rezervace, cekaci listina, ruseni rezervaci
router.post('/cviceni/:week/termin/:term/zadost');

// list my bookings and reservations
router.get('/cviceni/moje', ctrlWeek.getMyTerms);



// ADMIN ZONE: routes beyond this point are accessible only for admins
function isAdmin(user) {
console.log('usere ', user);
  return user && user.roles && user.roles.indexOf('admin') > -1;
}

router.use(function(req, res, next) {
  if (isAdmin(req.user)) {
console.log('je admin');
    next();
    return;
  }
  res.render('err403', {user: req.user});
});


// TODO: remove
//router.get('/admin', function(req, res) {
  //res.render('admin', {user: req.user});
//});


// list (work with) groups
router.get('/admin/skupiny', ctrlAccount.getCreateGroup);

router.get('/admin/skupina/:group', ctrlAccount.getGroup); // displays read-only view of a group with members and so on

// create empty group
router.get('/admin/skupiny/nova', ctrlAccount.getNewGroup);   // displays form with group: name, desc
router.post('/admin/skupiny/nova', ctrlAccount.postNewGroup); // fields: groupName,groupDesc,?groupSupervisors*,groupCreatedBy

// add users/groups to group
//router.get('/admin/skupina/:group/add', ctrl);
//router.post('/admin/skupina/:group/add', ctrl);   

// remove users/groups from group
//router.get('/admin/skupina/:group/remove', ctrl);  // TODO: from work with groups (list)
//router.post('/admin/skupina/:group/remove', ctrl);

// add/remove users/groups from group
router.get('/admin/skupina/:group/manage', ctrlAccount.getChangeGroupMembers);   // dispalys members of a group and allows drag other users/groups to add/remove. The list contains only eligible items.
router.post('/admin/skupina/:group/manage', ctrlAccount.postChangeGroupMembers);  // fields: addUsers*, addGroups*, removeUsers*, removeGroups*

// list members of group
router.get('/admin/skupina/:group/clenstvi', ctrlAccount.getGroupMembership);
router.get('/admin/skupina/:group/strom', ctrlAccount.getGroupTree);

// list user membership
router.get('/admin/uzivatel/:user/clenstvi', ctrlAccount.getUserMembership);
router.get('/admin/uzivatel/:user/strom', ctrlAccount.getUserTree);

// list group membership 
router.get('/admin/skupina/:group/je/clenem', ctrlAccount.getGroupIsMemberOf);

// create forum
router.get('/admin/forum/nove', ctrlForum.getCreateForum);
router.post('/admin/forum/nove', ctrlForum.postCreateForum);

// change forum
router.get('/admin/forum/:forum/uprava', ctrlForum.getChangeForum);
router.post('/admin/forum/:forum/uprava', ctrlForum.postChangeForum);

// remove forum
router.get('/admin/forum/:forum/odstraneni', ctrlForum.getDeleteForum);
router.post('/admin/forum/:forum/odstraneni', ctrlForum.postDeleteForum);

// add users/groups to forum
router.get('/admin/forum/:forum/skupiny', ctrlForum.getChangeForumMembers);
router.post('/admin/forum/:forum/skupiny', ctrlForum.postChangeForumMembers);

// zobraz kdo muze forum spravovat, psat do nej a cist
router.get('/admin/forum/:forum/prava', ctrlForum.getAuditForumParticipants);

// delete message
router.get('/admin/forum/:forum/zprava/:message/sdstraneni', ctrlForum.getDeletePost);  // ???
router.post('/admin/forum/:forum/zprava/:message/sdstraneni', ctrlForum.postDeletePost);

// block message
router.get('/admin/forum/:forum/zprava/:message/blokace', ctrlForum.getBlockPost);  // ???
router.post('/admin/forum/:forum/zprava/:message/blokace', ctrlForum.postBlockPost);

//
// disable user
router.get('/admin/uzivatel/:user/blokovat', ctrlAccount.getDisableUser);
router.post('/admin/uzivatel/:user/blokovat', ctrlAccount.postDisableUser);

// enable user
router.get('/admin/uzivatel/:user/odblokovat', ctrlAccount.getEnableUser);
router.post('/admin/uzivatel/:user/odblokovat', ctrlAccount.postEnableUser);

// delete user
router.get('/admin/uzivatel/:user/odstranit', ctrlAccount.getDeleteUser);
router.post('/admin/uzivatel/:user/odstranit', ctrlAccount.postDeleteUser);

// list users
router.get('/admin/uzivatele', ctrlAccount.getUsers);

//
// create empty week
router.get('/admin/tyden/novy', ctrlWeek.getCreateWeek);
router.post('/admin/tyden/novy', ctrlWeek.postCreateWeek);

// copy a week
router.get('/admin/tyden/:week/kopie', ctrlWeek.getCopyWeek);
router.post('/admin/tyden/:week/kopie', ctrlWeek.postCopyWeek);

// add day
//router.get('', ctrl);  // toto je z hlavniho editoru cviceni
//router.post('', ctrl); // toto je z hlavniho editoru cviceni

// delete day
//router.get('', ctrl);  // toto je z hlavniho editoru cviceni
//router.post('', ctrl);  // toto je z hlavniho editoru cviceni

// add term
//router.get('', ctrl);  // toto je z hlavniho editoru cviceni
//router.post('', ctrl);  // toto je z hlavniho editoru cviceni

// move term
//router.get('', ctrl);  // toto je z hlavniho editoru cviceni
//router.post('', ctrl);  // toto je z hlavniho editoru cviceni

// delete term
//router.get('', ctrl);  // toto je z hlavniho editoru cviceni
//router.post('', ctrl);  // toto je z hlavniho editoru cviceni

// change term
//router.get('', ctrl);  // toto je z hlavniho editoru cviceni
//router.post('', ctrl);  // toto je z hlavniho editoru cviceni

// week editor
router.get('/admin/tyden/:week/editor', ctrlWeek.getWeekEditor);
router.post('/admin/tyden/:week/editor', ctrlWeek.postWeekEditor);

// list bookings and reservations
router.get('/admin/tyden/:week/termin/:term', ctrlWeek.getBookings);

// list terms for admins
router.get('/admin/tyden/:week', ctrlWeek.getWeek);

// list weeks for admins
router.get('/admin/tydny', ctrlWeek.getAdminWeeks);
//router.get('/admin/tydny', (req, res) => {
  //console.log('tydny ', req.user);
  //res.render('not-impl');
//});



module.exports = router;
