const mongoose = require('mongoose')
const { Schema } = mongoose;

const BugSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date
    }
});
module.exports = mongoose.model('bugs', BugSchema);