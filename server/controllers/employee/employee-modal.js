var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    militaryId: { type: String, required: true },
    available: { type: Boolean, required: true },
    joinDate: { type: Date, required: true },
    leaveDate: { type: Date, required: true },
    image: { type: String, required: false },
    rate: { type: Number, required: false },
    onDuty: { type: Boolean, required: false },
    dutiable: { type: Boolean, required: false },
    // currentShift: { type: Number, required: true },
    // prevShift: { type: Number, required: true },
    empType: { type: String, required: true },
    vacationPeriod: { type: Number, required: false },
    extra: {
        shiftAreas: {
            type: [{ serviceArea: String, shiftNumber: Number, distDate: Date }], required: false
        }
    },
    age: { type: Number, required: false },
    servicesNumber: { type: Number, required: false },
    extraServices: { type: Number, required: false },
    section: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Section' },
    vacation: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'VacationType' },
    created_at: Date,
    updated_at: Date,
});

employeeSchema.pre('save', (next) => {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Employee = mongoose.model('Solider', employeeSchema);
module.exports = Employee;