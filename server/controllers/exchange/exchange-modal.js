var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vctSchema = new Schema({
    dist: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Distribute' },
    target: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Solider' },
    replaced: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Solider' },
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

var Exchange = mongoose.model('Exchange', vctSchema);
module.exports = Exchange;