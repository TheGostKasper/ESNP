var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Category' },
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

var SubCategory = mongoose.model('SubCategory', itemsSchema);
module.exports = SubCategory;