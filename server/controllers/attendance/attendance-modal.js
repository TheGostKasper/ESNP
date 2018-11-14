var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    name: String,
    visitReason: String,
    soliderId: String,
    status: { type: Boolean, required: true },
    enterDate: { type: Date, required: true },
    leaveDate: { type: Date, required: false },
    created_at: Date,
    updated_at: Date
});
attendanceSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = attendance;