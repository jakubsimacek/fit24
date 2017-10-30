const CircularJSON = require('circular-json');

const defaultDuration = 60; // default term duration if end not providet
const timePadding = 15;  // adds minutes after and before each term to calculate intervals

// common functions

let renderr = function (res, message, error, data) {
  data = data || {};
  res.status(500);
  res.render('error', { message: message, error: error, data: data });
}

let add = function (a, b) {
  return a + b;
}

// time manipulation
let dateToTimeStr = function (date) {
  return date.toISOString().substring(11, 16)
}

let timeStrToDate = function (timeStr) {
  return new Date('1970-01-01T' + timeStr + ':00.000Z')
}

// function adds the specified number of minutes to baseTime
let addToTime = function (baseTime, minutes) {
  const d = new Date(baseTime)
  d.setUTCMinutes(d.getUTCMinutes() + minutes)
  return d
}

// function subtracts the specified number of minutes from baseTime
let subFromTime = function (baseTime, minutes) {
  return addToTime (baseTime, -minutes)
}

const minStartTime = timeStrToDate('04:00')
const maxEndTime = timeStrToDate('22:00')
const minFreeBlockLength = 60

let formatCzDate = function (date) {
console.log(date.constructor.name);
  return formatDate('{day}.{month}.{year}', date);
}

const min = function(date1, date2) {
  return new Date(Math.min(date1, date2))
}

const max = function(date1, date2) {
  return new Date(Math.max(date1, date2))
}

// converts array of timeStr ('09:30') to Date objects 01/01/1970 09:30:00.000
let timeStrToDates = function (array) {
  return array.map(a => {
    return {
      startDate: timeStrToDate(a.start),
      endDate:   timeStrToDate(a.end)
    }
  })
}


// weeks, intervals, blocks - constants

const defMinIntersectionDuration = 15 // the intersectuin must be long at least as this in mins
const freeToIntervalGap = 5    // gap between edges of free and interval blocks
const minIntervalGap = 90      // min gap between 2 adjactment intervals


// weeks, intervals, blocks - helpers

let getDayIndex = function (array, day) {  // returns index to the array
  return array.findIndex(a => a.day == day)
}

let getDay = function (week, day) {
  const dayObj = week.days.find(d => d.day == day)
  return (dayObj) ? dayObj : { day: day, terms: [] }
}

let findBlock = function (array, time) {
  return array.find(a => a.startDate <= time && a.endDate >= time)
}

let recalculateBlock = function (startDate, endDate, free) {
  // narrowing free interval from left
  if (free.startDate <= endDate && free.startDate >= startDate){
    return { startDate : endDate, endDate : free.endDate };}
  // narrowing interval from right
  else if (free.endDate >= startDate && free.endDate <= endDate){
    return { startDate : free.startDate, endDate : startDate };}
  // splitting interval
  else if (free.startDate < startDate && free.endDate > endDate){
    return [{ startDate : free.startDate, endDate : startDate}, 
            { startDate : endDate, endDate : free.endDate }] }
  return { startDate : free.startDate, endDate : free.endDate }
}

// weeks, intervals, blocks

let calculateFreeBlocks = function (week) {
  let arrFree = [ { startDate : timeStrToDate('04:00'), endDate : timeStrToDate('22:00') }];

  week.days.map(d => {
    d.terms.map(t => {
      const startDate = subFromTime(timeStrToDate(t.start), timePadding);
      const endDate = (t.end) ? addToTime(timeStrToDate(t.end), timePadding) 
                              : addToTime(startDate, defaultDuration + 2*timePadding);
      const tempMap = arrFree.map(free => {
        return recalculateBlock(startDate, endDate, free)
      }) // tempMap
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > addToTime(free.startDate, minFreeBlockLength); // free interval valid and at least minFreeBlockLength hour wide
      })
    }) // terms
  }) // days

  return arrFree.map(t => { return { start : dateToTimeStr(t.startDate), end : dateToTimeStr(t.endDate) }}) 
}

let calculateFreeBlocksForDay = function (week, day) {

  let arrFree = [{ startDate : minStartTime, endDate : maxEndTime }]
  
    const currentDayIx = getDayIndex(week.days, day)

    getDay(week, day).terms.map(t => {
      const startDate = subFromTime(timeStrToDate(t.start), timePadding);
      const endDate = (t.end) ? addToTime(timeStrToDate(t.end), timePadding) 
                              : addToTime(startDate, defaultDuration + 2*timePadding)
      let tempMap = arrFree.map(free => {
        return recalculateBlock(startDate, endDate, free)
      }) //tempMap
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > addToTime(free.startDate, minFreeBlockLength); // free interval valid and at least minFreeBlockLength hour wide
      })
    }) //terms
  return arrFree.map(d => {
    return {
      start : dateToTimeStr(d.startDate), 
      end :   dateToTimeStr(d.endDate)
    }
  })  
}

let calculateFreeBlocksForWeek = function (week) {

  let arrFreeDays = ['po', 'ut', 'st', 'ct', 'pa', 'so', 'ne'].map(di => {
    return { day: di, freeBlocks: [{ startDate : minStartTime, endDate : maxEndTime }] }
  })
  let arrFree = []
  
  week.days.map(d => {
    const currentDayIx = getDayIndex(arrFreeDays, d.day)
    arrFree = arrFreeDays[currentDayIx].freeBlocks   // TODO: mozna cist primo a vyhodit index
    d.terms.map(t => {
      const startDate = subFromTime(timeStrToDate(t.start), timePadding);
      const endDate = (t.end) ? addToTime(timeStrToDate(t.end), timePadding) 
                              : addToTime(startDate, defaultDuration + 2*timePadding)
      let tempMap = arrFree.map(free => {
        return recalculateBlock(startDate, endDate, free)
      }) //tempMap
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > addToTime(free.startDate, minFreeBlockLength); // free interval valid and at least minFreeBlockLength hour wide
      })
    }) //terms
    arrFreeDays[currentDayIx].freeBlocks = arrFree
  }) //days

  return arrFreeDays.map(d => {
    return {
      day: d.day,
      freeBlocks: d.freeBlocks.map(f => {
        return { 
          start : dateToTimeStr(f.startDate), 
          end : dateToTimeStr(f.endDate)
        }
      })
    }
  })
}


// intersections

let getIntersection = function (intervals, freeBlocks, minIntersectionDuration) {
  if (!minIntersectionDuration)
    minIntersectionDuration = defMinIntersectionDuration
  const idates = timeStrToDates(intervals)
  const tempCol = freeBlocks.map(free => {
    const startFree = timeStrToDate(free.start)
    const endFree = timeStrToDate(free.end)
    return idates.map(intv => {
      if (endFree >= intv.startDate && startFree <= intv.endDate) {
        const maxStartTime = max(startFree, intv.startDate)
        const minEndTime = min(endFree, intv.endDate)
        if (((minEndTime - maxStartTime) / 60000) > minIntersectionDuration) // 60000 ms -> mins
          return {
            start: dateToTimeStr(maxStartTime),
            end:   dateToTimeStr(minEndTime)
          }
        else
          return {}
      }
      else {
        return {}
      }
    })
  })
  return [].concat.apply([], tempCol).filter(x => x != undefined && x.start && x.end)
}



// finds new interval boundaries for sliding in editor
let getIntervalBoundaries = function (intervals, freeBlocks, minIntervalLength) {
  const fdates = timeStrToDates(freeBlocks)
  return timeStrToDates(intervals).map((i, ix, arr) => {
    const freeStart = findBlock(fdates, i.startDate)
    if (freeStart == undefined)
      throw "Inconsisten interval/free data of start"
    // left (from) end
    const minPossibleStartDate = (ix == 0) ? freeStart.startDate   //minTime  // toto nedava smysl 
                                           : addToTime(arr[ix - 1].endDate, minIntervalGap)
    const maxPossibleStartDate = subFromTime(freeStart.endDate, freeToIntervalGap)
    // right (to) end
    const freeEnd = findBlock(fdates, i.endDate)
    if (freeEnd == undefined)
      throw "Inconsisten interval/free data of end"
    const minPossibleEndDate = addToTime(freeEnd.startDate, freeToIntervalGap)
    const maxPossibleEndDate = (ix == (arr.length - 1)) ? freeEnd.endDate  //maxTime  // toto nedava smysl
                                                        : subFromTime(arr[ix + 1].startDate, minIntervalGap) 
    return {
      minStart: dateToTimeStr(minPossibleStartDate),
      maxStart: dateToTimeStr(maxPossibleStartDate),
      minEnd:   dateToTimeStr(minPossibleEndDate),
      maxEnd:   dateToTimeStr(maxPossibleEndDate)
    }
  })
}

// display functions

let gerRulerStartTime = function (fromTime) {
  const tParts = fromTime.split(":")
  const hh = tParts[0]
  const mm = tParts[1]
  return (parseInt(mm, 10) >= 30) ? hh + ":30" : hh + ":00"
}

let gerRulerEndTime = function (toTime) {
  const tParts = fromTime.split(":")
  const hh = tParts[0]
  const mm = tParts[1]
  const hhNum = partseInt(hh, 10) + 1
  return (parseInt(mm, 10) >= 30) ? hh + ":30" 
                                   : ((hhNum < 10) ? "0" + hhNum 
                                                   : hhNum)  + ":00"
}

let getTimeStrParts = function (timeStr) {
  const tParts = timeStr.split(":")
  return {
    h: parseInt(tParts[0], 10),
    m: parseInt(tParts[1], 10)
  }
}

let recalculateRuler = function (week) {

  const intervals = week.weekDisplayProps.intervals
  const lastIdx = intervals.length - 1

  const rulerStarts = getTimeStrParts(intervals[0].from)
  const rulerEnds = getTimeStrParts(intervals[lastIdx].to)

  const pixFirstGap = 15
  const pixIntermGap = 47
  const pixEndGap = 20
  const pixLeft = 280
  const pixHour = 80

  const minSuppressLastRule = 10   // if last hour is to narrow, dont display the number (TODO)

  const firstWholeHour = (rulerStarts.m == 0) ? rulerStarts.h : rulerStarts.h + 1
  const lastWholeHour = rulerStarts.h

  const intervalDates = timeStrToDates(intervals)

  let curLeft = pixLeft
  intervals.forEach(interv => {
    const intervStartParts = getTimeStrParts(interv)
    const intervEndParts = getTimeStrParts(interv)
    
    const firstWholeHour = (intervStartParts.m == 0) ? intervStartParts.h : intervStartParts.h + 1
    const lastWholeHour = intervalEndParts.h

      for (i = rirstWholeHour; i <= lastWholeHour; i++) {
      ruler[i].enabled = true
      if (i == lastWholeHour)
        ruler[i].gap = true
      curLeft += pixHour
    }
  })
}


/*  // iterate hours
  for (i = firstWholeHour; i <= lastWholeHour; i++) {
    const currInterval = findBlock(intervalDates, timeStrToDate(xxxx))
    //if (
  } 
  // iterate intervals
  const ruler = []
  for (i = 4; i <= 22; i++) {
    ruler.push({
      h: i,
      enabled: false,
      gap: false,
  }*/
module.exports.renderr = renderr
module.exports.add = add
module.exports.dateToTimeStr = dateToTimeStr
module.exports.timeStrToDate = timeStrToDate
module.exports.addToTime = addToTime
module.exports.subFromTime = subFromTime
module.exports.formatCzDate = formatCzDate
module.exports.findBlock = findBlock
module.exports.calculateFreeBlocks = calculateFreeBlocks
module.exports.calculateFreeBlocksForDay = calculateFreeBlocksForDay
module.exports.calculateFreeBlocksForWeek = calculateFreeBlocksForWeek
module.exports.getIntersection = getIntersection
module.exports.getIntervalBoundaries = getIntervalBoundaries
module.exports.gerRulerStartTime = gerRulerStartTime
module.exports.gerRulerEndTime = gerRulerEndTime
module.exports.recalculateRuler = recalculateRuler
