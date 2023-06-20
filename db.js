const mongoose = require('mongoose');
require('dotenv').config();
const DB_API = process.env.DB_API;

const mongooseConnect = () => {
    mongoose.connect(DB_API).then(() => {
        console.log("connected")
    }).
        catch(error => console.log(error));
}

module.exports = mongooseConnect;
