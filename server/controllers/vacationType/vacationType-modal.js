var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vctSchema = new Schema({
    name: { type: String, required: true },
    durationCount: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: Date,
});
vctSchema.pre('save', (next) => {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var VacationType = mongoose.model('VacationType', vctSchema);
module.exports = VacationType;