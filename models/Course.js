const mongoose = require('mongoose')
const { Schema } = mongoose;

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date
    }
});
module.exports = mongoose.model('course', CourseSchema);