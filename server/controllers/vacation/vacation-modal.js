var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
    name: String,
    number:Number,
    start:Date,
    end:Date,
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

var Vacation = mongoose.model('Vacation', typeSchema);
module.exports = Vacation;