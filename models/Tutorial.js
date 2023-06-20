const mongoose = require('mongoose')
const { Schema } = mongoose;

const TutorialSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date
    }
});
module.exports = mongoose.model('tutorial', TutorialSchema);