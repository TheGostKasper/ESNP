var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
    name: String,
    gun_id:String,
    totalSoldiers:Number,
    difficulty:Number,
    describtion:String,
    s_count:Number,
    status:Boolean,
    priority:Number,
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

var ServiceArea = mongoose.model('ServiceArea', typeSchema);
module.exports = ServiceArea;