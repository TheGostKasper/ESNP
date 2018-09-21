var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    name: { type: String, required: true },
    // type: { type: String, required: true },
    month: { type: Date, required: true },
    paidMoney: { type: Number, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, required: false , ref:'Solider'},
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

var Salary = mongoose.model('Salary', itemsSchema);
module.exports = Salary;