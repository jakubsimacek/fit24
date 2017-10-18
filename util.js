const CircularJSON = require('circular-json');

const defaultDuration = 60;
const timePadding = 15;  // adds minutes after and before each term to calculate intervals

module.exports.renderr = function (res, message, error, data) {
  data = data || {};
  res.status(500);
  res.render('error', { message: message, error: error, data: data });
}

let dateToTimeStr = function (date) {
  return date.toISOString().substring(11, 16)
}

module.exports.dateToTimeStr = dateToTimeStr;
// converts string "14:45" into 14.45, ...
/*
let timeToDec = function (timeStr) {
  const tParts = timeStr.split(":");
  const hh = Number(tParts[0]);
  const mm = Number(tParts[1]);
  return Number(hh + (mm/100)).toFixed(2);
}
module.exports.timeToDec = timeToDec;
*/
let timeStrToDate = function (timeStr) {
  return new Date('1970-01-01T' + timeStr + ':00.000Z')
}
module.exports.timeStrToDate = timeStrToDate;

// function adds the specified number of minutes to baseTime
let addToTime = function (baseTime, minutes) {
/*  const baseHours = Math.floor(baseTime);
  const baseMins = (baseTime - baseHours) * 100;
  let addHours = Math.floor(minutes / 60);
  const addMins = minutes - addHours * 60;
  let  intermAdd = Math.round(baseMins + addMins);
//console.log('i: ' + intermAdd);
  if (intermAdd >= 60) {
    intermAdd -= 60;
    addHours += 1;
  }
  return baseHours + addHours + (intermAdd / 100);
*/
  const d = new Date(baseTime)
  d.setUTCMinutes(d.getUTCMinutes() + minutes)
  return d
}
module.exports.addToTime = addToTime;

// function subtracts the specified number of minutes from baseTime
let subFromTime = function (baseTime, minutes) {
/*  const baseHours = Math.floor(baseTime);
  const baseMins = (baseTime - baseHours) * 100;
  let subtractHours = Math.floor(minutes / 60);
  const subtractMins = minutes - subtractHours * 60;
  let intermSub = baseMins - subtractMins;

  if (intermSub < 0) {
    intermSub += 60;
    subtractHours += 1;
  }
//  return Math.round(baseHours - subtractHours - (intermSub / 100), -2);
  return Number(baseHours - subtractHours + (intermSub / 100)).toFixed(2);
*/
  return addToTime (baseTime, -minutes)
}
module.exports.subFromTime = subFromTime;

module.exports.makeTimeOccupation = function (week) {
  let arrFree = [ { startDate : timeStrToDate('04:00'), endDate : timeStrToDate('22:00') }];

  week.days.map(d => { //console.log('d: ' + CircularJSON.stringify(d));
    d.terms.map(t => { //console.log('t: ' + CircularJSON.stringify(t));
      const startDate = subFromTime(timeStrToDate(t.startTime), timePadding);
      const endDate = (t.endTime) ? addToTime(timeStrToDate(t.endTime), timePadding) : addToTime(startDate, defaultDuration + 2*timePadding);
//console.log('startDate: ' + startDate + ', endDate: ' + endDate);
      const tempMap = arrFree.map(free => {           //console.log('free: ' + CircularJSON.stringify(free));
        // narrowing free interval from left
        if (free.startDate <= endDate && free.startDate >= startDate){//console.log('1: ');
          return { startDate : endDate, endDate : free.endDate };}
        // narrowing interval from right
        else if (free.endDate >= startDate && free.endDate <= endDate){//console.log('2: ');
          return { startDate : free.startDate, endDate : startDate };}
        // splitting interval
        else if (free.startDate < startDate && free.endDate > endDate){//console.log('3: ');
          return [{ startDate : free.startDate, endDate : startDate}, 
                  { startDate : endDate, endDate : free.endDate }] }
        return { startDate : free.startDate, endDate : free.endDate }
      });
  //    console.log(CircularJSON.stringify(tempMap));
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > addToTime(free.startDate, 60); // free interval valid and at least +1 hour wide
      })
    })
  })
  //console.log('ret: ' + CircularJSON.stringify(arrFree));
  return arrFree.map(t => { return { startTime : dateToTimeStr(t.startDate), endTime : dateToTimeStr(t.endDate) }}) 
}

/*
module.exports.makeTimeOccupation = function (week) {
  let arrFree = [ { start : 4.00, end : 22.00 }];
//console.log('top');
  week.days.map(d => { //console.log('d: ' + CircularJSON.stringify(d));
    d.terms.map(t => { //console.log('t: ' + CircularJSON.stringify(t));
      const start = subFromTime(timeToDec(t.start), timePadding);
      const end = (t.end) ? addToTime(timeToDec(t.end), timePadding) : addToTime(start, defaultDuration + 2*timePadding);
console.log('start: ' + start + ', end: ' + end);
      const tempMap = arrFree.map(free => {console.log('free: ' + CircularJSON.stringify(free));
        // narrowing free interval from left
        if (free.start <= end && free.start >= start){console.log('1: ');
          return { start : end, end : free.end };}
        // narrowing interval from right
        else if (free.end >= start && free.end <= end){console.log('2: ');
          return { start : free.start, end : start };}
        // splitting interval
        else if (free.start < start && free.end > end){console.log('3: ');
          return [{ start : free.start, end : start}, 
                  { start : end, end : free.end }];}
        return { start : free.start, end : free.end };
      });
  //    console.log(CircularJSON.stringify(tempMap));
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.end > free.start + 1; // free interval valid and at least +1 hour wide
      });
    });
  });
  //console.log('ret: ' + CircularJSON.stringify(arrFree));
  return arrFree;
}
*/
module.exports.add = function (a, b) {
  return a + b;
}

module.exports.formatCzDate = function (date) {
console.log(date.constructor.name);
  return formatDate('{day}.{month}.{year}', date);
}
