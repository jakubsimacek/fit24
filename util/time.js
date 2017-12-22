
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
