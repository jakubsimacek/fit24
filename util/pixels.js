const tm = require('./time')
const intv = require('./interval')

const pixStart = 120    // all starts here
const pixIntGap = 47      // pixels in the gap
const pixPerHour = 180
const pixPerMin = pixPerHour / 60  // pixels per minute

// returns index of an interval and time offset in it
const getTimeInIntervals = function (intervals, time) {

}

// calculates duration of first n the intervals
const sumIntLenMin = function(intervals, n) {
}

// calculates position of an element given by its time
const getPosition = function (intervals, time) {
  const n = intervals.length
  let pos = pixStart + sumIntLenMin(intervals, n - 1) * pixPerMin + (n - 1) * pixIntGap + intTimeMin * pixPerMin
}

// helper function
function makeRulerItem(hour, gap, left) {
  return {
    gap : gap,
    time : hour + ":00",
    left : left
  }
}

const calculateRuler = function (weekEnr) {
  const ia = weekEnr.intervals
  const rulerStartTime = tm.roundStartTime(ia[0].startDate)
  const rulerStartHour = rulerStartTime.getUTCHours()
  const rulerStartMinute = ia[0].startDate.getUTCMinutes()
  const rulerEndTime = ia[ia.length-1].endDate
  const rulerEndHour = rulerEndTime.getUTCHours()
  let rulerFullHourTime = new Date(rulerStartTime)
/*  if (rulerStartMinute == 0)
    rulerFullHourTime = new Date(rulerStartTime)
  else {
    rulerFullHourTime = new Date(rulerStartTime)
    rulerFullHourTime.setUTCHours(rulerStartTime.getUTCHours()+1)
    rulerFullHourTime.setUTCMinutes(0)
  }*/
  const ruler = []
  let left = pixStart + (rulerStartMinute * pixPerMin)
  let prevHour = null //rulerStartHour
//  let gap = false
//  let lastGap = false

  for (h = rulerStartHour; h <= rulerEndHour; h++) {
    const bl = intv.findBlock(ia, rulerFullHourTime)
    if (bl == null) {
//console.log('not found for ' + h)
//console.log(rulerFullHourTime)
      if (prevHour != null) {
        ruler.push(makeRulerItem(prevHour, h != rulerStartHour, left))
        left += pixIntGap
//console.log('prev ' + prevHour)
        prevHour = null
      }
//      gap = true
    }
    else {
//console.log('found for ' + h)
//console.log(rulerFullHourTime)
      if (prevHour != null) {
        ruler.push(makeRulerItem(prevHour, false, left))
        left += pixPerHour
//console.log('prev ' + prevHour)
      }
      prevHour = h
//      gap = false
    }
    rulerFullHourTime = new Date(rulerFullHourTime)
    rulerFullHourTime.setUTCHours(rulerFullHourTime.getUTCHours() + 1)
  }
  if (prevHour != null) {
    ruler.push(makeRulerItem(prevHour, false, left))
    left += pixPerHour
//console.log('prev ' + prevHour)
  }
  return ruler

}
module.exports.calculateRuler = calculateRuler

// to recycle
const getRulerStartTime = function (time) {
  return tm.roundStartTime(time)
}
module.exports.getRulerStartTime = getRulerStartTime

