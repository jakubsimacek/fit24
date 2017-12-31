const time = require('./time')
const CircularJSON = require('circular-json')
const util = require('../util')

const defaultDuration = 60; // default term duration if end not providet
const timePadding = 15;  // adds minutes after and before each term to calculate intervals

const minStartTime = time.timeStrToDate('04:00')
const maxEndTime = time.timeStrToDate('22:00')
const minFreeBlockLength = 60

function dbg(o, msg) {
  if (msg == undefined)
    msg = ''
  else
    msg += ': '
  console.log(msg, CircularJSON.stringify(o))
}

// enrich day array of terms (add dateTime objects)
let enrichDayArray = function (dayArray) {
    return dayArray.map(t => {
      const startDate = time.timeStrToDate(t.start)
      const endDate = (t.end) ? time.timeStrToDate(t.end) : time.addToTime(startDate, defaultDuration)

      return { start     : t.start,
               startDate : startDate, 
               endDate   : endDate,
               end       : time.dateToTimeStr(endDate)
      }
    }) // terms
}
module.exports.enrichDayArray = enrichDayArray

// enrich week (add dateTime objects)
module.exports.enrichWeek = function (week) {
//dbg(week.days, 'W')
  const days = week.days.map(d => {
/*    const terms = d.terms.map(t => {
//dbg(t, 'ENR')
      const startDate = time.timeStrToDate(t.start)
      const endDate = (t.end) ? time.timeStrToDate(t.end) : time.addToTime(startDate, defaultDuration)

      return { start     : t.start,
               startDate : startDate, 
               endDate   : endDate,
               end       : time.dateToTimeStr(endDate)
      }
    }) // terms */
    const terms = (d.terms) ? enrichDayArray(d.terms) : []
    return { day : d.day, terms : terms }
  }) // days
  const intervals = (week.intervals) ? enrichDayArray(week.intervals)
                                     : []
  return { days : days,
           intervals : intervals
         }
}

// returns an array of free blocks (occupied blocks are surrounded with 'timePadding')
// TODO: externalize min time 4am and max time 22pm
module.exports.calculateFreeBlocks = function (weekEnrch) {
  let arrFree = [ { startDate : time.timeStrToDate('04:00'), endDate : time.timeStrToDate('22:00') }];

  weekEnrch.days.map(d => {
    d.terms.map(t => {
      const startDate = time.subFromTime(t.startDate, timePadding)
      const endDate   = time.addToTime(t.endDate, timePadding)
      const tempMap = arrFree.map(free => {
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
      }) // tempMap
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > time.addToTime(free.startDate, minFreeBlockLength); // free interval valid and at least minFreeBlockLength hour wide
      })
    }) // terms
  }) // days

  return arrFree.map(t => { return { start : time.dateToTimeStr(t.startDate), end : time.dateToTimeStr(t.endDate) }}) 
}

// this helper function returns index of the day in an array (week)
let getDayIndex = function (array, day) {  // returns index to the array
  return array.findIndex(a => a.day == day)
}

// this helper function returns the day structure corresponding to the day (e.g. terms)
let getDay = function (week, day) {
  const dayObj = week.days.find(d => d.day == day)
  return (dayObj) ? dayObj : { day: day, terms: [] }
}

// this day calculates free block for a given day (where you can put new terms)
module.exports.calculateFreeBlocksForDay = function (week, day) {

  let arrFree = [{ startDate : minStartTime, endDate : maxEndTime }]
  
//  week.days.map(d => {
//console.log('day: ' + d.day)
    const currentDayIx = getDayIndex(week.days, day)

    getDay(week, day).terms.map(t => {
      const startDate = time.subFromTime(t.startDate, timePadding);
      const endDate = time.addToTime(t.endDate, timePadding)
      let tempMap = arrFree.map(free => {
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
 
      }) //tempMap
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > time.addToTime(free.startDate, minFreeBlockLength); // free interval valid and at least minFreeBlockLength hour wide
      })
    }) //terms
//    arrFreeDays[currentDayIx].freeBlocks = arrFree
//console.log('freeDays: ' + JSON.stringify(arrFreeDays))
//  }) //days

  return arrFree.map(d => {
    return {
      start : time.dateToTimeStr(d.startDate), 
      end :   time.dateToTimeStr(d.endDate)
    }
  })  
}

// this function calculates free blocks for the given week
module.exports.calculateFreeBlocksForWeek = function (week) {

  let arrFreeDays = ['po', 'ut', 'st', 'ct', 'pa', 'so', 'ne'].map(di => {
    return { day: di, freeBlocks: [{ startDate : minStartTime, endDate : maxEndTime }] }
  })
  let arrFree = []
  
  week.days.map(d => {
//console.log('day: ' + d.day)
    const currentDayIx = getDayIndex(arrFreeDays, d.day)
    arrFree = arrFreeDays[currentDayIx].freeBlocks   // TODO: mozna cist primo a vyhodit index
    d.terms.map(t => {
      const startDate = time.subFromTime(t.startDate, timePadding);
      const endDate = time.addToTime(t.endDate, timePadding)

      let tempMap = arrFree.map(free => {
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
 
      }) //tempMap
      arrFree = [].concat.apply([], tempMap).filter(free => {
        return free.endDate > time.addToTime(free.startDate, minFreeBlockLength); // free interval valid and at least minFreeBlockLength hour wide
      })
    }) //terms
    arrFreeDays[currentDayIx].freeBlocks = arrFree
//console.log('freeDays: ' + JSON.stringify(arrFreeDays))
  }) //days

  return arrFreeDays.map(d => {
    return {
      day: d.day,
      freeBlocks: d.freeBlocks.map(f => {
        return { 
          start : time.dateToTimeStr(f.startDate), 
          end : time.dateToTimeStr(f.endDate)
        }
      })
    }
  })
}



// converts array of timeStr ('09:30') to Date objects 01/01/1970 09:30:00.000
// TODO: move it to utils/time.js
/*let timeStrToDates = function (array) {
  return array.map(a => {
    return {
      startDate: time.timeStrToDate(a.start),
      endDate:   time.timeStrToDate(a.end)
    }
  })
}*/

// intersections
const defMinIntersectionDuration = 15 // the intersectuin must be long at least as this in mins

// function returns intersection ???
let getIntersection = function (intervals, freeBlocks, minIntersectionDuration) {
  if (!minIntersectionDuration)
    minIntersectionDuration = defMinIntersectionDuration
  const idates = intervals //timeStrToDates(intervals)
  const tempCol = freeBlocks.map(free => {
    const startFree = free.startDate //time.timeStrToDate(free.start)
    const endFree = free.endDate //time.timeStrToDate(free.end)
    return idates.map(intv => {
      if (endFree >= intv.startDate && startFree <= intv.endDate) {
        const maxStartTime = util.max(startFree, intv.startDate)
        const minEndTime = util.min(endFree, intv.endDate)
//console.log('max: ' + maxStartTime)
//console.log('min: ' + minEndTime)
//console.log('diff: ' + ((minEndTime - maxStartTime)/60000))
        if (((minEndTime - maxStartTime) / 60000) > minIntersectionDuration) // 60000 ms -> mins
          return {
            start: time.dateToTimeStr(maxStartTime),
            end:   time.dateToTimeStr(minEndTime)
          }
        else
          return {}
      }
      else {
        return {}
      }
    })
  })
//console.log('xxx' + CircularJSON.stringify(tempCol))
//console.log('yyy' + CircularJSON.stringify([].concat.apply([], tempCol)))
  return [].concat.apply([], tempCol).filter(x => x != undefined && x.start && x.end)
}

module.exports.getIntersection = getIntersection

// returns block in the array for the given time
let findBlock = function (array, time) {
  return array.find(a => a.startDate <= time && a.endDate >= time)
}
module.exports.findBlock = findBlock

const freeToIntervalGap = 5    // gap between edges of free and interval blocks
const minIntervalGap = 90      // min gap between 2 adjactment intervals
//const minTime = time.timeStrToDate('04:00')
//const maxTime = time.timeStrToDate('22:00')  // tohle tady nedava smysl, to uz je zohledneno v free blokach

// finds new interval boundaries for sliding in editor
let getIntervalBoundaries = function (intervals, freeBlocks, minIntervalLength) {
  const fdates = freeBlocks //timeStrToDates(freeBlocks)
//  return timeStrToDates(intervals).map((i, ix, arr) => {
  return intervals.map((i, ix, arr) => {
    const freeStart = findBlock(fdates, i.startDate)
    if (freeStart == undefined)
      throw "Inconsisten interval/free data of start"
    // left (from) end
    const minPossibleStartDate = (ix == 0) ? freeStart.startDate   //minTime  // toto nedava smysl 
                                           : time.addToTime(arr[ix - 1].endDate, minIntervalGap)
    const maxPossibleStartDate = time.subFromTime(freeStart.endDate, freeToIntervalGap)
    // right (to) end
    const freeEnd = findBlock(fdates, i.endDate)
    if (freeEnd == undefined)
      throw "Inconsisten interval/free data of end"
    const minPossibleEndDate = time.addToTime(freeEnd.startDate, freeToIntervalGap)
    const maxPossibleEndDate = (ix == (arr.length - 1)) ? freeEnd.endDate  //maxTime  // toto nedava smysl
                                                        : time.subFromTime(arr[ix + 1].startDate, minIntervalGap) 
    return {
      minStart: time.dateToTimeStr(minPossibleStartDate),
      maxStart: time.dateToTimeStr(maxPossibleStartDate),
      minEnd:   time.dateToTimeStr(minPossibleEndDate),
      maxEnd:   time.dateToTimeStr(maxPossibleEndDate)
    }
  })
}

module.exports.getIntervalBoundaries = getIntervalBoundaries
