var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    name: { type: String, required: true },
    describtion: { type: String, required: false },
    headMaster: { type: mongoose.Schema.Types.ObjectId, required: false , ref:'Employee'},
    rate: { type: Number, default: 5 },
    created_at: { type: Date, required: true },
    updated_at: Date,
});
itemsSchema.pre('save', (next) => {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Section = mongoose.model('Section', itemsSchema);
module.exports = Section;