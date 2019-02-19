const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const user = require('./routes/user')
const signup = require('./routes/signup')
const account = require('./routes/account')

const app = express()
module.exports = app

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static('assets'))
app.use(methodOverride('_method'))

app.use('/user', user)
app.use('/signup', signup)
app.use('/account', account)

app.get('/', (req, res, next) => {
  const newUser = req.query.username === undefined ? '' : req.query.username
  const wrongUsername =
    req.query.wrongUsername === undefined
      ? false
      : Boolean(req.query.wrongUsername)
  res.render('index', { wrongUsername, newUser })
})
