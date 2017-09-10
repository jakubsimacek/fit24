const assert = require('assert');
const util = require('../util');

describe('test time functions', function() {

  it('conv time 1', function() {
    assert.equal(4.00, util.timeToDec('4:00'));
  });

  it('conv time 2', function() {
    assert.equal(4.55, util.timeToDec('4:55'));
  });

  it('add time - simple', function() {
    assert.equal(4.50, util.addToTime(4, 50));
  });

  it('add time - sharp hours', function() {
    assert.equal(4.00, util.addToTime(3, 60));
  });

  it('add time - overflow', function() {
    assert.equal(5.10, util.addToTime(4.50, 20));
  });

  it('add time - overflow 2 hrs', function() {
    assert.equal(6.10, util.addToTime(4.50, 80));
  });

  it('add time - overflow 3 hrs', function() {
    assert.equal(15.00, util.addToTime(13.45, 75));
  });

  it('add time - add 175 mins', function() {
    assert.equal(7.45, util.addToTime(4.50, 175));
  });

  it('add time - add 295 mins', function() {
    assert.equal(9.45, util.addToTime(4.50, 295));
  });

  // subtracting
  it('subtract time - simple', function() {
    assert.equal(4.00, util.subFromTime(4.50, 50));
  });

  it('subtract time - sharp', function() {
    assert.equal(4.00, util.subFromTime(5.00, 60));
  });

  it('subtract time - overflow', function() {
    assert.equal(4.50, util.subFromTime(5.10, 20));
  });

  it('subtract time - overflow 2 hrs', function() {
    assert.equal(4.50, util.subFromTime(6.10, 80));
  });

  it('subtract time - add 175 mins', function() {
    assert.equal(4.50, util.subFromTime(7.45, 175));
  });

  it('subtract time - add 295 mins', function() {
    assert.equal(4.50, util.subFromTime(9.45, 295));
  });
});

describe('test interval functions', function() {

  it('test intervals - empty', function() {
    let emptyWeek = { days : [ {terms : []}, { terms : []}]};
    assert.deepEqual([{ start : 4.00, end : 22.00 }], util.makeTimeOccupation(emptyWeek));
  });

  it('test intervals - 1 term - split', function() {
    let emptyWeek = { days : [ {terms : [ { start : "14:00" } ]}, { terms : []}]};
    assert.deepEqual(util.makeTimeOccupation(emptyWeek), [{ start : 4.00, end : 13.45 },
                                                         { start : 15.15, end : 22.00 }]);
  });

  it('test intervals - 2 term - split+shift from left', function() {
    let emptyWeek = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "14:15" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(emptyWeek), [{ start : 4.00, end : 13.45 },
                                                         { start : 15.30, end : 22.00 }]);
  });

  it('test intervals - 2 term - gap removal', function() {
    let emptyWeek = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "15:30" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(emptyWeek), [{ start : 4.00, end : 13.45 },
                                                         { start : 16.45, end : 22.00 }]);
  });

  it('test intervals - 2 term - bigger gap removal', function() {
    let emptyWeek = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "16:25" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(emptyWeek), [{ start : 4.00, end : 13.45 },
                                                         { start : 17.40, end : 22.00 }]);
  });

  it('test intervals - 2 term - bigger gap not removal', function() {
    let emptyWeek = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "16:35" } ]}]};
    assert.deepEqual(util.makeTimeOccupation(emptyWeek), [{ start : 4.00, end : 13.45 },
                                                         { start : 15.15, end : 16.20 }, 
                                                         { start : 17.50, end : 22.00 }]);
  });

  it.only('test intervals - 3 term - orange', function() {
    let emptyWeek = { days : [ { terms : [ { start : "14:00" } ]}, 
                               { terms : [ { start : "16:35" } ]},
                               { terms : [ { start : "17:30" } ]} ]};
    assert.deepEqual(util.makeTimeOccupation(emptyWeek), [{ start : 4.00, end : 13.45 },
                                                         { start : 15.15, end : 16.20 }, 
                                                         { start : 17.50, end : 22.00 }]);
  });


});
