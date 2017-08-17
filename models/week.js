let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let peopleList = {
    userId: {type: String, required: true, unique: true},
    userName: {type: String, required: true},
    count: {type: Number, required: true, min: 1}
};

let ruler = {
    time: {type: String, required: true},
    left: {type: Number, required: true},
    gap: {type: Boolean, required: true},
};

let interval = {
    from: {type: String, required: true},
    to: {type: String, required: true},
};

let weekDisplayProps = {
    firstGap: {type: Number, required: true},
    intermGap: {type: Number, required: true},
    endGap: {type: Number, required: true},
    ruler: {type: [ruler], required: true},
    intervals: {type: [interval], required: true},
};

let termDisplayProps = {
    left: {type: Number, required: true},
    top: {type: Number, required: true},
};

let term = {
    id: {type: String, required: true},
    start: {type: String, required: true},
    duration: {type: Number, required: true},
    timestamp: {type: String, required: true},
    line1: {type: String, required: true},
    line2: String,
    coach: {type: String, required: true},
    capacity: Number,
    termDisplayProps: {type: termDisplayProps, required: true},
    booked: peopleList,
    reserved: peopleList,
    cancelling: peopleList
};

let days = {
    day: {type: String, required: true},
    terms: {type: term, required: false},
};

let week = {
    state: {type: String, required: true},
    name: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    description: {type: String, required: true},
    weekDisplayProps: {type: weekDisplayProps, required: true},
    days: {type: [days], required: true}
};

let Week = new Schema(week);

module.exports = mongoose.model('Week', Week);

