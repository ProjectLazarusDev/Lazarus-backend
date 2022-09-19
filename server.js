// ensure that localhost is using a localhost database 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const metaRouter = require('./routes/metas')
const genesisRouter = require('./routes/genesis')
const moonbaseRouter = require('./routes/moonbase')
const userRouter = require('./routes/users')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(cors())
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(cookieParser());
app.use(express.json())

const mongoose = require('mongoose')
const { urlencoded } = require('body-parser')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/metas', metaRouter)
app.use('/genesis', genesisRouter)
app.use('/moonbases', moonbaseRouter)
app.use('/users', userRouter)

app.listen(process.env.PORT || 3001)