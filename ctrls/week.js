const Week = require('../models/week');
const util = require('../util');
const formatDate = require('format-date');

function add(a, b) {
  return a + b;
}

function formatCzDate(date) {
console.log(date.constructor.name);
  return formatDate('{day}. {month}. {year}', date);
}

//router.get('/admin/tyden/novy', 
module.exports.getCreateWeek = function (req, res) {
  res.render('createWeek', {user: req.user});
}


//router.post('/admin/tyden/novy', 
module.exports.postCreateWeek = function (req, res) {
  if (!req.body.weekStartDate)
    res.render('error', {user: req.user, message: 'no start date', error: {}}); //TODO: return to add_week with an error message
  else {
    let newWeek = {
      state: 'new',
      startDate: req.body.weekStartDate,
      endDate: 'n/a',
      description: 'n/a',
      weekDisplayProps: {
        firstGap: 15,
        intermGap: 47,
        endGap: 20,
        tableWidth: 1005,
        ruler: [
        {
          "time" : "7:00",
          "left" : 180,
          "gap" : false
        },
        {
          "time" : "8:00",
          "left" : 360,
          "gap" : true
        },
        {
          "time" : "16:00",
          "left" : 407,
          "gap" : true
        },
        {
          "time" : "17:00",
          "left" : 587,
          "gap" : false
        },
        {
          "time" : "18:00",
          "left" : 767,
          "gap" : false
        },
        {
          "time" : "19:00",
          "left" : 947,
          "gap" : false
        }],
        "intervals" : [
        {
          "from" : "6:20",
          "to"   : "8:00"
        },
        {
          "from" : "16:00",
          "to"   : "19:00"
        }]
      },
      days: [
      {
        day: 'po',
        terms: {}
      },
      {
        day: 'ut',
        terms: {}
      },
      {
        day: 'st',
        terms: {}
      },
      {
        day: 'ct',
        terms: {}
      },
      {
        day: 'pa',
        terms: {}
      }]
    };
    Week.create(newWeek, (err, results) => {
      if (err)
        util.renderr(res, 'Cannot save a new week', err, newWeek);
      else
        res.redirect('/admin/tyden/' + req.body.weekStartDate);   // TODO: check the :week
    });
  }
}


//router.get('/admin/tyden/:week/editor', 
module.exports.getWeekEditor = function (req, res) {
  Week.findOne({ startDate: req.params.week }, (err, week) => {
   if (err)
     util.renderr(res, 'Nemuzu najit tyden', error);
   else
     res.render('cviceni', {user: req.user, session: { userName: req.user.username, isAdmin: true },
       testParams: true, data: week});
  });
}

//router.get('/admin/tydny', 
module.exports.getAdminWeeks = function (req, res) {
  //console.log('admin-tydny', req.user);
  Week.find({}, (err, weeks) => {
    if (err)
      render('error', { user: req.user, error: err });
    else {
      let aggWeeks = weeks.map(w => {
        const noTerms = w.days.map(d => (d.terms) ? d.terms.length : 0).reduce(add, 0);
        const noSections = w.weekDisplayProps.intervals.length;
        const capacity = w.days.map(d => {
          if (d.terms)
            return d.terms.map(t => {
              t.capacity.reduce(add, 0);
            });
          else
            return 0;
        }).reduce(add, 0); 
        const noBookings = w.days.map(d => {
          if (d.terms)
            return d.terms.map(t => {
              t.booked.count.reduce(add, 0);
            });
          else
            return 0;
        }).reduce(add, 0); 
        const noReservations = w.days.map(d => {
          if (d.terms)
            return d.terms.map(t => {
              t.reserved.count.reduce(add, 0);
            });
          else
            return 0;
        }).reduce(add, 0); 
        console.log(noTerms);
        return { name: w.name,
                 startDate: formatCzDate(w.startDate),
                 noTerms: noTerms,
                 noSections: noSections,
                 capacity: capacity,
                 noBookings: noBookings,
                 noReservations: noReservations,
                 description: w.description,
                 state: w.state
        };
      }); 
      console.log('weeks to render: ', aggWeeks);
      console.log('I\'m ' + req.user);
      res.render('adminWeeks', {user: req.user, weeks: aggWeeks});
    }
  });
}


// -------------------- TODO -------------------------------------------

//router.get('/cviceni/tydny', 
module.exports.getWeeks = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/cviceni', 
module.exports.getCurrentWeek = function (req, res) {
  console.log(req.user);
  res.render('not-impl', {user: req.user});
}

//router.get('/cviceni/:week', 
module.exports.getWeek = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/cviceni/moje', 
module.exports.getMyTerms = function (req, res) {

  res.render('not-impl', {user: req.user});
}


//router.get('/admin/tyden/:week/kopie', 
module.exports.getCopyWeek = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/tyden/:week/kopie', 
module.exports.postCopyWeek = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.post('/admin/tyden/:week/editor', 
module.exports.postWeekEditor = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/tyden/:week/termin/:term', 
module.exports.getBookings = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/tyden/:week', 
module.exports.getWeek = function (req, res) {

  res.render('not-impl', {user: req.user});
}



