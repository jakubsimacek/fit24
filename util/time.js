const formatDate = require('format-date');

let dateToTimeStr = function (date) {
  return date.toISOString().substring(11, 16)
}

module.exports.dateToTimeStr = dateToTimeStr;
let timeStrToDate = function (timeStr) {
  return new Date('1970-01-01T' + timeStr + ':00.000Z')
}
module.exports.timeStrToDate = timeStrToDate;

// function adds the specified number of minutes to baseTime
let addToTime = function (baseTime, minutes) {
  const d = new Date(baseTime)
  d.setUTCMinutes(d.getUTCMinutes() + minutes)
  return d
}
module.exports.addToTime = addToTime;

// function subtracts the specified number of minutes from baseTime
let subFromTime = function (baseTime, minutes) {
  return addToTime (baseTime, -minutes)
}
module.exports.subFromTime = subFromTime;

// rounds time to half hour for the ruler -- Todo not valid anymore
const roundStartTime = function (time) {
  const d = new Date(time)
  let min = 0
  const origMins = time.getUTCMinutes() 
//  if (origMins >= 30)
//    min = 30
  d.setUTCMinutes(min)
  if (origMins > 0)
    d.setUTCHours(time.getUTCHours() + 1)
  return d
}
module.exports.roundStartTime = roundStartTime

// helper function
module.exports.formatCzDate = function (date) {
//console.log(date.constructor.name);
  return formatDate('{day}.{month}.{year}', date);
}





// to recycle
// returns first full hour of the ruler
const firstFullHour = function (time) {
  if (time.getUTCMinutes() == 0)
    return time.getUTCHours()
  else
    return time.getUTCHours() + 1
}
module.exports.firstFullHourXXX = firstFullHour

