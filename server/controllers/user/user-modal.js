var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    type_id: { type: String, required: false }, // Employee , supplier , customer , ....
    availability: Boolean,
    images: { type: String, required: false },
    extra: {
        transactions: {
            type: [{ order_id: String, comment: String, created_at: Date ,trans_type:String , action:String}], required: false
        }
    },
    age: Number,
    address: { type: String, required: false },    
    location: { type: { lat: String, lng: String }, required: false },
    created_at: Date,
    updated_at: Date,
});
userSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;