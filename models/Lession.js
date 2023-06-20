const mongoose = require('mongoose')
const { Schema } = mongoose;

const LessionSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date
    }
});
module.exports = mongoose.model('lession', LessionSchema);