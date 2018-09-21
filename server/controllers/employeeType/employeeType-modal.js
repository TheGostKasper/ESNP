var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
    name: String,
    created_at: Date,
    updated_at: Date
});
typeSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var EmployeeType = mongoose.model('EmployeeType', typeSchema);
module.exports = EmployeeType;