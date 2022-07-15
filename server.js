// ensure that localhost is using a localhost database 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const cors = require('cors')

const indexRouter = require('./routes/index')
const metaRouter = require('./routes/metas')
const contractRouter = require('./routes/contracts')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(cors())
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter);
app.use('/metas', metaRouter);
app.use('/contracts', contractRouter);

app.listen(process.env.PORT || 3001)