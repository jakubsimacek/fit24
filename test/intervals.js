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
    assert.deepEqual([{ startTime : '04:00', endTime : '22:00' }], util.makeTimeOccupation(emptyWeek));
  });

  it('test intervals - 1 term - split', function() {
    let week = { days : [ {terms : [ { startTime : "14:00" } ]}, { terms : []}]};
    assert.deepEqual(util.makeTimeOccupation(week), [{ startTime : '04:00', endTime : '13:45' },
                                                         { startTime : '15:15', endTime : '22:00' }]);
  });

  it('test intervals - 2 term - split+shift from left', function() {
    let week = { days : [ { terms : [ { startTime : "14:00" } ]}, 
                               { terms : [ { startTime : "14:15" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(week), [{ startTime : '04:00', endTime : '13:45' },
                                                         { startTime : '15:30', endTime : '22:00' }]);
  });

  it('test intervals - 2 term - gap removal', function() {
    let week = { days : [ { terms : [ { startTime : "14:00" } ]}, 
                               { terms : [ { startTime : "15:30" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(week), [{ startTime : '04:00', endTime : '13:45' },
                                                         { startTime : '16:45', endTime : '22:00' }]);
  });

  it('test intervals - 2 term - bigger gap removal', function() {
    let week = { days : [ { terms : [ { startTime : "14:00" } ]}, 
                               { terms : [ { startTime : "16:25" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(week), [{ startTime : '04:00', endTime : '13:45' },
                                                         { startTime : '17:40', endTime : '22:00' }]);
  });

  it('test intervals - 2 term - bigger gap not removal', function() {
    let week = { days : [ { terms : [ { startTime : "14:00" } ]}, 
                               { terms : [ { startTime : "16:35" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(week), [{ startTime : '04:00', endTime : '13:45' },
                                                         { startTime : '15:15', endTime : '16:20' }, 
                                                         { startTime : '17:50', endTime : '22:00' }]);
  });

  it('test intervals - 3 term - orange', function() {
    let week = {      days : [ { terms : [ { startTime : "14:00" } ]}, 
                               { terms : [ { startTime : "16:35" } ]},
                               { terms : [ { startTime : "17:30" } ]} ]};
    assert.deepEqual(util.makeTimeOccupation(week), [{ startTime : '04:00', endTime : '13:45' },
                                                     { startTime : '15:15', endTime : '16:20' }, 
                                                     { startTime : '18:45', endTime : '22:00' }]);
    //   f                f             x              f 
    //       13:45 - 15:15 16:20 - 17:50 17:15 - 18:45         occup.
     //  ok            ok            not-ok        ok
  });// 04:00-13:45   15:15-16:20   17:50-17:15   18:45-22:00   free


});
