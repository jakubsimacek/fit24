const Week = require('../models/week');
const Account = require('../models/account');
const util = require('../util');
const formatDate = require('format-date');
const CircularJSON = require('circular-json');

const timePadding = 15;  // adds minutes after and before each term to calculate intervals

// converts string "14:45" into 14.45, ...
/*function timeToDec(timeStr) {
  const tParts = timeStr.split(":");
  const hh = partseInt(tParts[0], 10);
  const mm = partseInt(tParts[1], 10);
  return hh * (mm/100);
}*/

// function adds the specified number of minutes to baseTime
/*function addToTime(baseTime, minutes) {
  const baseHours = Math.floor(baseTime);
  const baseMins = (baseTime - baseHours) * 100;
  const addHours = Math.floor(minutes / 60);
  const addMins = minutes - addHours * 60;
  const intermAdd = baseMins + addMins;
  if (intermAdd >= 60) {
    intermAdd -= 60;
    addHours += 1;
  }
  return baseHours + addHours + (intermAdd / 100);
}*/

// function subtracts the specified number of minutes from baseTime
/*function subFromTime(baseTime, minutes) {
  const baseHours = Math.floor(baseTime);
  const baseMins = (baseTime - baseHours) * 100;
  const subtractHours = Math.floor(minutes / 60);
  const subtractMins = minutes - subtractHours * 60;
  const intermAdd = baseMins - addMins;
  if (intermAdd < 0) {
    intermAdd -= 60;
    addHours -= 1;
  }
  return baseHours + addHours + (intermAdd / 100);
}*/
/*
function makeTimeOccupation(week) {
  let arrFree = [ { start : 4.00, end : 22.00 }];
  week.days.map(d => { 
    d.terms.map(t => {
      const start = subFromTimeToDec(t.start, timePadding);
      const end = (t.end) ? addToTime(timeToDec(t.end), timePadding) : addToTime(start, defaultDuration + timePadding);
      const tempMap = arrFree.map(free => {
        // narrowing free interval from left
        if (free.start <= end && free.start > start)
          return { start : end, free.end };
        else if (free.end >= start && free.end < end)
          return { start : free.start, end : start };
        else if (free.start < start && free.end > end)
          return [{ start : free.start, end : start}, { start : end, end : free.end }];
        return { start : free.start, end : free.end };
      }
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.end > free.start + 1; // free interval valid and at least +1 hour wide
      };
    };
  };
  return arrF]ree;
}*/

/*function add(a, b) {
  return a + b;
}*/

/*function formatCzDate(date) {
console.log(date.constructor.name);
  return formatDate('{day}.{month}.{year}', date);
}*/



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
  console.log(':week=' + CircularJSON.stringify(req.params.week));
  Week.findById(req.params.week, (err, week) => {
   if (err)
     util.renderr(res, 'Nemuzu najit tyden', error);
   else {
     console.log('admin tyden ' + week);
/* usecases:
  delete_interval: {start_time}
    G: util.getDeletabeIntervals // one must remain, must not contain terms
    P: util.deleteInterval(week, startTime)
       util.recalculateRuler(week)
       week.save()

  change_interval_start:
    G: util.getIntervalBoundaries(intervals, freeBlocks, minIntervalLength)
    P: util.changeIntervalStart(week, oldStartTime, newStartTime)
       util.recalculateRuler(week)
       week.save()

  change_interval_end:
    G: util.getIntervalBoundaries(intervals, freeBlocks, minIntervalLength)
    P: util.changeIntervalStart(week, oldStartTime, newEndTime)
       util.recalculateRuler(week)
       week.save()

  split_interval:
    G: util.getIntervalSplitingBlocks(week)
    P: util.spitInterval(week, startTime, newEndTime, newStartTime)
       util.recalculateRuler(week)
       week.save() 

  join_intervals:
    P: util.joinIntervals(startTimeFirst)
       util.recalculateRuler(week)
       week.save()

  add_term
  delete_term {term id}
  move_term {term id; new term id} [[term id = DY_HH:MI (po_16:45)]]
  update_term {term id; line 1, line 2, coach ...}
  add_term_booking {term id; person, number}
  remove_term_booking {term id; person, number}
  add_term_reservation {term id; person, number}
  remove_term_reservation {term id; person, number}

*/
     // coaches
     // blocks
     // acquire lock
     // lock
     // selected term
     //   booked
     //   reserved
     //   cancelling
     //
     //   new term/edit term
     //     start
     //     duration
     //     text 1
     //     text 2
     //     coach
     //     day
     //
     //   enabled (week) will be visible - add to list view
     //
     //   blocks (intervals)
     //     start time (min, max) [remove]
     //     end time (min, max)
     //
     //     gap (min, max) [remove]
     //     
     //     start
     //     end time ....
     //     [add block]
     //     may be insert block???
     //     actions: insert, add, delete, resize
//     const intervals = { };
     const timeOccupation = util.calculateFreeBlocks(week)    
     //
     //   locked at ...
     //   locked by ...
     //
     //   [release lock]
     //
     //   [reset]
     //
     //   [save]
     //
     //   booked
     //     name
     //     number
     //     [remove]
     //
     //   dto reserved
     //
     //   save buttons for each block
     const editor = { 
//       intervals: intervals,
       timeOccupation: timeOccupation
     };

     res.render('cviceni', {user: req.user, 
                            session: {
                              userName: req.user.username, 
                              isAdmin: true, 
                              editor: editor
                            },
                            testParams: true, 
                            data: week});
   }
  });
}

//router.post('/admin/tyden/:week/editor', 
module.exports.postWeekEditor = function (req, res) {
  // get submit button name
  // switch what to do
  // do it n times
  res.render('not-impl', {user: req.user});
}


//router.get('/admin/tydny', 
module.exports.getAdminWeeks = function (req, res) {
  //console.log('admin-tydny', req.user);
  Week.find({}, (err, weeks) => {
    if (err)
      render('error', { user: req.user, error: err });
    else {
console.log('weeks:' + weeks);
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
        return { id: w._id,
                 name: w.name,
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

//router.get('/admin/tyden/:week/termin/:term', 
module.exports.getBookings = function (req, res) {

  res.render('not-impl', {user: req.user});
}

//router.get('/admin/tyden/:week', 
module.exports.getWeek = function (req, res) {

  res.render('not-impl', {user: req.user});
}



