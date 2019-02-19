const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const DBMethods = require('./DataAccess/db')
const knownErrorHandler = require('./errorFunctions')

const app = express()
module.exports = app

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static('assets'))
app.use(methodOverride('_method'))
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

app.get('/', (req, res, next) => {
  const newUser = req.query.username === undefined ? '' : req.query.username
  const wrongUsername =
    req.query.wrongUsername === undefined
      ? false
      : Boolean(req.query.wrongUsername)
  res.render('index', { wrongUsername, newUser })
})

app.get('/user', (req, res, next) => {
  DBMethods.getAndTransformUserEntries(req.query.username)
    .then(entries => {
      res.render('mainPage', {
        username: req.query.username,
        entries,
        error: req.query.error,
        changingEntry: req.query.changingEntry
      })
    })
    .catch(err =>
      knownErrorHandler(
        'user does not exist',
        '/?wrongUsername=true',
        err,
        res,
        next
      )
    )
})

app.post('/user', (req, res, next) => {
  DBMethods.createEntriesInstance(
    req.query.username,
    req.body.firstItem,
    req.body.secondItem
  )
    .then(() => res.redirect(`/user?username=${req.query.username}`))
    .catch(err =>
      knownErrorHandler(
        [
          'Must enter non-empty values for both items',
          'You have already this entry'
        ],
        `/user?username=${req.query.username}&error=${err.message}`,
        err,
        res,
        next
      )
    )
})

app.delete('/user/:entryId', (req, res, next) => {
  DBMethods.deleteEntriesInstanceById(Number(req.params.entryId))
    .then(() => res.redirect(`/user?username=${req.query.username}`))
    .catch(next)
})

app.put('/user/:entryId', (req, res, next) => {
  DBMethods.updateEntriesInstanceById(
    req.query.username,
    Number(req.params.entryId),
    req.body.firstItem,
    req.body.secondItem
  )
    .then(() => res.redirect(`/user?username=${req.query.username}`))
    .catch(err =>
      knownErrorHandler(
        [
          'Must enter non-empty values for both items',
          'You have already this entry'
        ],
        `/user?username=${req.query.username}&error=${
          err.message
        }&changingEntry=true`,
        err,
        res,
        next
      )
    )
})

app.get('/signup', (req, res, next) => {
  res.render('signupPage', { error: req.query.error })
})

app.post('/signup', (req, res, next) => {
  DBMethods.createUsersInstance(req.body.username)
    .then(() => {
      res.redirect(`/?username=${req.body.username}`)
    })
    .catch(err =>
      knownErrorHandler(
        'Username already exists. Pick a different username',
        `/signup?error=${err.message}`,
        err,
        res,
        next
      )
    )
})

app.get('/account', (req, res, next) => {
  res.render('userAccountPage', {
    username: req.query.username,
    error: req.query.error
  })
})

app.put('/account', (req, res, next) => {
  DBMethods.updateUserName(req.body.oldusername, req.body.newusername)
    .then(() => res.redirect(`/account?username=${req.body.newusername}`))
    .catch(err =>
      knownErrorHandler(
        'Username already exists. Pick a different username',
        `/account?username=${req.body.oldusername}&error=${err.message}`,
        err,
        res,
        next
      )
    )
})

app.delete('/account', (req, res, next) => {
  DBMethods.deleteAccount(req.body.username)
    .then(() => res.redirect(`/`))
    .catch(next)
})
