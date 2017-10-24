const assert = require('assert');
const util = require('../util');

describe('test time functions', function() {

  it('conv time 1', function() {
    assert.deepStrictEqual('04:00', util.dateToTimeStr(util.timeStrToDate('04:00')));
  });

  it('conv time 2', function() {
    assert.equal('04:55', util.dateToTimeStr(util.timeStrToDate('04:55')));
  });

  it('add time - simple', function() {
    assert.equal('04:50', util.dateToTimeStr(util.addToTime(util.timeStrToDate('04:00'), 50)));
  });

  it('add time - sharp hours', function() {
    assert.equal('04:00', util.dateToTimeStr(util.addToTime(util.timeStrToDate('03:00'), 60)));
  });

  it('add time - overflow', function() {
    assert.equal('05:10', util.dateToTimeStr(util.addToTime(util.timeStrToDate('04:50'), 20)));
  });

  it('add time - overflow 2 hrs', function() {
    assert.equal('06:10', util.dateToTimeStr(util.addToTime(util.timeStrToDate('04:50'), 80)));
  });

  it('add time - overflow 3 hrs', function() {
    assert.equal('15:00', util.dateToTimeStr(util.addToTime(util.timeStrToDate('13:45'), 75)));
  });

  it('add time - add 175 mins', function() {
    assert.equal('07:45', util.dateToTimeStr(util.addToTime(util.timeStrToDate('04:50'), 175)));
  });

  it('add time - add 295 mins', function() {
    assert.equal('09:45', util.dateToTimeStr(util.addToTime(util.timeStrToDate('04:50'), 295)));
  });

  // subtracting
  it('subtract time - simple', function() {
    assert.equal('04:00', util.dateToTimeStr(util.subFromTime(util.timeStrToDate('04:50'), 50)));
  });

  it('subtract time - sharp', function() {
    assert.equal('04:00', util.dateToTimeStr(util.subFromTime(util.timeStrToDate('05:00'), 60)));
  });

  it('subtract time - overflow', function() {
    assert.equal('04:50', util.dateToTimeStr(util.subFromTime(util.timeStrToDate('05:10'), 20)));
  });

  it('subtract time - overflow 2 hrs', function() {
    assert.equal('04:50', util.dateToTimeStr(util.subFromTime(util.timeStrToDate('06:10'), 80)));
  });

  it('subtract time - add 175 mins', function() {
    assert.equal('04:50', util.dateToTimeStr(util.subFromTime(util.timeStrToDate('07:45'), 175)));
  });

  it('subtract time - add 295 mins', function() {
    assert.equal('04:50', util.dateToTimeStr(util.subFromTime(util.timeStrToDate('09:45'), 295)));
  });
});

describe('test interval functions', function() {

  it('test intervals - empty', function() {
    let emptyWeek = { days : [ {terms : []}, { terms : []}]};
    assert.deepEqual([{ start : '04:00', end : '22:00' }], util.calculateFreeBlocks(emptyWeek));
  });

  it('test intervals - 1 term - split', function() {
    let week = { days : [ {terms : [ { start : "14:00" } ]}, { terms : []}]};
    assert.deepEqual(util.calculateFreeBlocks(week), [{ start : '04:00', end : '13:45' },
                                                         { start : '15:15', end : '22:00' }]);
  });

  it('test intervals - 2 term - split+shift from left', function() {
    let week = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "14:15" } ]}]};
    assert.deepEqual(util.calculateFreeBlocks(week), [{ start : '04:00', end : '13:45' },
                                                         { start : '15:30', end : '22:00' }]);
  });

  it('test intervals - 2 term - gap removal', function() {
    let week = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "15:30" } ]}]};
    assert.deepEqual(util.calculateFreeBlocks(week), [{ start : '04:00', end : '13:45' },
                                                         { start : '16:45', end : '22:00' }]);
  });

  it('test intervals - 2 term - bigger gap removal', function() {
    let week = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "16:25" } ]}]};
    assert.deepEqual(util.calculateFreeBlocks(week), [{ start : '04:00', end : '13:45' },
                                                         { start : '17:40', end : '22:00' }]);
  });

  it('test intervals - 2 term - bigger gap not removal', function() {
    let week = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "16:35" } ]}]};
    assert.deepEqual(util.calculateFreeBlocks(week), [{ start : '04:00', end : '13:45' },
                                                         { start : '15:15', end : '16:20' }, 
                                                         { start : '17:50', end : '22:00' }]);
  });

  it('test intervals - 3 term - orange', function() {
    let week = {      days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "16:35" } ]},
                               { terms : [ { start : "17:30" } ]} ]};
    assert.deepEqual(util.calculateFreeBlocks(week), [{ start : '04:00', end : '13:45' },
                                                     { start : '15:15', end : '16:20' }, 
                                                     { start : '18:45', end : '22:00' }]);
    //   f                f             x              f 
    //       13:45 - 15:15 16:20 - 17:50 17:15 - 18:45         occup.
     //  ok            ok            not-ok        ok
  });// 04:00-13:45   15:15-16:20   17:50-17:15   18:45-22:00   free


});

describe('test interval intersection', function() {

  it('test intervals - empty', function() {
    let int = []
    let free = []
    assert.deepEqual([], util.getIntersection(int, free));
  });

  it('test intervals - left miss', function() {
    let int = [{ start: '08:00', end: '09:00'}]
    let free = [{ start: '18:00', end: '19:00'}]
    assert.deepEqual([], util.getIntersection(int, free));
  });

  it('test intervals - left miss with touch', function() {
    let int = [{ start: '08:00', end: '09:00'}]
    let free = [{ start: '09:00', end: '10:00'}]
    assert.deepEqual([], util.getIntersection(int, free));
  });

  it('test intervals - left intersec', function() {
    let int = [{ start: '08:00', end: '09:00'}]
    let free = [{ start: '08:00', end: '09:30'}]
    assert.deepEqual([{ start: '08:00', end: '09:00'}], util.getIntersection(int, free));
  });

  it('test intervals - left intersec2', function() {
    let int = [{ start: '08:00', end: '09:00'}]
    let free = [{ start: '08:30', end: '09:30'}]
    assert.deepEqual([{ start: '08:30', end: '09:00'}], util.getIntersection(int, free));
  });

  it('test intervals - mid inner intersec', function() {
    let int = [{ start: '08:00', end: '09:00'}]
    let free = [{ start: '08:15', end: '08:45'}]
    assert.deepEqual([{ start: '08:15', end: '08:45'}], util.getIntersection(int, free));
  });

  it('test intervals - mid outer intersec', function() {
    let int = [{ start: '08:15', end: '08:45'}]
    let free = [{ start: '08:00', end: '09:00'}]
    assert.deepEqual([{ start: '08:15', end: '08:45'}], util.getIntersection(int, free));
  });

  it('test intervals - mid outer intersec - too short', function() {
    let int = [{ start: '08:15', end: '08:16'}]
    let free = [{ start: '08:00', end: '09:00'}]
    assert.deepEqual([], util.getIntersection(int, free));
  });

  it('test intervals - right intersec - with touch', function() {
    let int = [{ start: '08:30', end: '09:00'}]
    let free = [{ start: '08:00', end: '09:00'}]
    assert.deepEqual([{ start: '08:30', end: '09:00'}], util.getIntersection(int, free));
  });

  it('test intervals - right intersec', function() {
    let int = [{ start: '08:30', end: '09:30'}]
    let free = [{ start: '08:00', end: '09:00'}]
    assert.deepEqual([{ start: '08:30', end: '09:00'}], util.getIntersection(int, free));
  });

  it('test intervals - right miss', function() {
    let int = [{ start: '08:30', end: '09:30'}]
    let free = [{ start: '09:30', end: '09:45'}]
    assert.deepEqual([], util.getIntersection(int, free));
  });

  it('test intervals - right miss2', function() {
    let int = [{ start: '08:30', end: '09:30'}]
    let free = [{ start: '10:30', end: '10:45'}]
    assert.deepEqual([], util.getIntersection(int, free));
  });

  it('test intervals - complex', function() {
    let int = [{ start: '08:30', end: '09:30'},
               { start: '10:30', end: '11:30'},
               { start: '13:30', end: '17:30'},
               { start: '19:30', end: '21:30'}]
    let free = [{ start: '04:00', end: '08:00'},
                { start: '10:30', end: '10:31'},
                { start: '10:45', end: '14:00'},
                { start: '14:30', end: '20:00'},
                { start: '22:45', end: '22:00'}]
    assert.deepEqual([{start: '10:45', end: '11:30'},
                      {start: '13:30', end: '14:00'},
                      {start: '14:30', end: '17:30'},
                      {start: '19:30', end: '20:00'}], util.getIntersection(int, free));
  });

})

describe('test interval boundaries', function() {
  it('findBlock - simple', function() {
    const start = util.timeStrToDate('08:00')
    const end = util.timeStrToDate('09:00')
    const time = util.timeStrToDate('08:30')
    assert.deepEqual({ startDate: start, endDate: end }, 
                     util.findBlock([{ startDate: start, endDate: end }], time))
  })
  it('test intervals - complex', function() {
    let int = [{ start: '08:30', end: '11:30'},
               { start: '13:30', end: '17:30'},
               { start: '19:00', end: '21:30'}]
    let free = [{ start: '04:00', end: '09:00'},
                { start: '10:00', end: '10:30'},
                { start: '11:00', end: '14:00'},
                { start: '17:15', end: '19:45'},
                { start: '21:00', end: '22:00'}]
    assert.deepEqual([{minStart: '04:00', maxStart: '08:55', minEnd: '11:05', maxEnd: '12:00'},
                      {minStart: '13:00', maxStart: '13:55', minEnd: '17:20', maxEnd: '17:30'},
                      {minStart: '19:00', maxStart: '19:40', minEnd: '21:05', maxEnd: '22:00'}
                   ], util.getIntervalBoundaries(int, free, 90));
  });

})

describe('test day free blocks', function() {
  it('test free blocks for a day - simple', function() {
    let week = {  
    days:[  
      {  
         day:'po',
         terms:[  
            {  
               start:'08:00',
               end:  '09:00'
            }
         ]
      },
      {  
          day:'ut',
          terms:[  
            {  
               start:'18:00'
            }
          ]
        }
      ]
    }

    assert.deepEqual(
      [
        { start: '04:00', end: '17:45' },
        { start: '19:15', end: '22:00' }
      ], util.calculateFreeBlocksForDay(week, 'ut'));
  })

  it('test free blocks for a day - more complex', function() {
    let week = {  
    days:[  
      {  
         day:'po',
         terms:[  
            {  
               start:'08:00',
               end:  '09:00'
            }
         ]
      },
      {  
          day:'ut',
          terms:[  
            {  
               start:'10:00',
               end:  '11:15'
            },
            {  
               start:'16:30'
            },
            {  
               start:'18:00'
            }
          ]
        }
      ]
    }

    assert.deepEqual(
      [
        { start: '04:00', end: '09:45' },
        { start: '11:30', end: '16:15' },
        { start: '19:15', end: '22:00' }
      ], util.calculateFreeBlocksForDay(week, 'ut'));
  })

  it('test free blocks for a week - complex', function() {
    let week = {  
   days:[  
      {  
         day:'po',
         terms:[  
            {  
               start:'08:00',
               end:  '09:00'
            }
         ]
      },
      {  
          day:'ut',
          terms:[  
            {  
               start:'18:00'
            }
          ]
      }
    ]
}

    assert.deepEqual(
      [
        {
          day: 'po',
          freeBlocks: [
            { start: '04:00', end: '07:45' },
            { start: '09:15', end: '22:00' }
          ]
        },
        {
          day: 'ut',
          freeBlocks: [
            { start: '04:00', end: '17:45' },
            { start: '19:15', end: '22:00' }
          ]
        },
        {
          day: 'st',
          freeBlocks: [
            { start: '04:00', end: '22:00' }
          ]
        },
        {
          day: 'ct',
          freeBlocks: [
            { start: '04:00', end: '22:00' }
          ]
        },
        {
          day: 'pa',
          freeBlocks: [
            { start: '04:00', end: '22:00' }
          ]
        },
        {
          day: 'so',
          freeBlocks: [
            { start: '04:00', end: '22:00' }
          ]
        },
        {
          day: 'ne',
          freeBlocks: [
            { start: '04:00', end: '22:00' }
          ]
        }
      ], util.calculateFreeBlocksForWeek(week));
  })

})
