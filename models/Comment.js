const mongoose = require('mongoose')
const { Schema } = mongoose;

const CommentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    lession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lession'
    },
    bug: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bugs'
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date
    }
});
module.exports = mongoose.model('comments', CommentSchema);