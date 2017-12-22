const tm = require('./time')

const pixStart = 180    // all starts here
const pixIntGap = -1      // pixels in the gap
const pixPerMin = 180 / 60  // pixels per minute

// returns index of an interval and time offset in it
const getTimeInIntervals = function (intervals, time) {

}

// calculates duration of first n the intervals
const sumIntLenMin = function(intervals, n) {
}

// calculates position of an element given by its timeStr
const getPosition = function (intervals, timeStr) {
  const n = intervals.length
  const time = tm.timeStrToDate(timeStr)
  const 
  let pos = pixStart + sumIntLenMin(intervals, n - 1) * pixPerMin + (n - 1) * pixIntGap + intTimeMin * pixPerMin
}
