require('dotenv').config()
require('express-async-errors')
const express = require('express')
const path = require('path')
const errorHandler = require('./middlewares/errorHandler')
const credentials = require('./middlewares/credentials');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/connectDB')
const mongoose = require('mongoose')
const helmet = require('helmet');

const app = express()
const PORT = process.env.PORT || 8000

connectDB()

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cookieParser())

app.use(cors(corsOptions))

app.use(express.json())

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))


app.use('/', express.static(path.join(__dirname, 'public')))

//* Routes
app.use('/auth', require('./routes/authRoutes'))
app.use('/', require('./routes/shopRoutes'))
app.use('/favorate', require('./routes/favorateRoutes'))


app.all('*', (req, res) => {
    res.json({ message: '404 Not Found' })
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
})
