var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    name: { type: String, required: true },
    barcode: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    amount: { type: Number, required: true },
    price: { type: Number, required: false },
    notes: { type: String, required: false },
    status: { type: Boolean, required: false },
    subCategory: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'SubCategory' },
    section: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Section' },
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

var Item = mongoose.model('Item', itemsSchema);
module.exports = Item;