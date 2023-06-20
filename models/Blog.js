const mongoose = require('mongoose')
const { Schema } = mongoose;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
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
module.exports = mongoose.model('blog', BlogSchema);