const express = require('express')
const mongooseConnect = require('./db')
const app = express();
const cors = require('cors')
require('dotenv').config();
var bodyParser = require('body-parser')
const PORT = process.env.APP_PORT || 5000
mongooseConnect()

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json())

app.use('/api/auth', require('./routers/auth'))
app.use('/api/course', require('./routers/course'))
app.use('/api/lession', require('./routers/lession'))
app.use('/api/tutorial', require('./routers/tutorial'))
app.use('/api/blog', require('./routers/blog'))
app.use('/api/bug', require('./routers/bug'))
app.use('/api', require('./routers/search'))

app.listen((PORT), () => {
    console.log("Listening port on", PORT)
})
