var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var distributeSchema = new Schema({
    soliders: {
        type:
            [{
                srvAre: { type: String, required: true },
                srcSolds: [{ _id: String, name: String }]
            }]
    },
    created_at: { type: Date, required: true },
    updated_at: Date,
});
distributeSchema.pre('save', (next) => {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Distribute = mongoose.model('Distribute', distributeSchema);
module.exports = Distribute;