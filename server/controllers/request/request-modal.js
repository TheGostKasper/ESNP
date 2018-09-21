var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    reasonToRequest: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, required: true , ref:'Employee'},
    feedback:String,
    created_at: Date,
    updated_at: Date,
});
itemsSchema.pre('save', (next) => {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Items = mongoose.model('Requests', itemsSchema);
module.exports = Items;