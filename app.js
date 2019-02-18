const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const DBMethods = require('./DataAccess/db')

const app = express()
module.exports = app

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

app.get('/', (req, res, next) => {
  const wrongUsername =
    req.query.wrongUsername === undefined
      ? false
      : Boolean(req.query.wrongUsername)
  res.render('index', { wrongUsername })
})

const errorFunction = (messages, route, next, res, err) => {
  if (messages.include(err.messages)) {
    return res.redirect(route)
  }
  return next(err)
}

app.get('/user', (req, res, next) => {
  DBMethods.getAndTransformUserEntries(req.query.username)
    .then(entries => {
      res.render('userAccountPage', {
        username: req.query.username,
        entries,
        addingEntryError: Boolean(req.query.addingEntryError)
      })
    })
    .catch(err =>
      errorFunction(
        'user does not exist',
        '/?wrongUsername=true',
        next,
        res,
        err
      )
    )
})

app.get('/user/:entryId/update', (req, res, next) => {
  DBMethods.getAndTransformUserEntries(req.query.username)
    .then(entries => {
      res.render('updatePage', {
        username: req.query.username,
        entries,
        selectedEntryId: Number(req.params.entryId)
      })
    })
    .catch(next)
})

app.post('/user', (req, res, next) => {
  DBMethods.createEntriesInstance(
    req.query.username,
    req.body.firstItem,
    req.body.secondItem
  )
    .then(() => res.redirect(`/user?username=${req.query.username}`))
    .catch(err =>
      errorFunction(
        'Must enter non-empty values for both items',
        `/user?username=${req.query.username}&addingEntryError=true`,
        next,
        res,
        err
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
    Number(req.params.entryId),
    req.body.firstItem,
    req.body.secondItem
  )
    .then(() => res.redirect(`/user?username=${req.query.username}`))
    .catch(next)
})

app.get('/account/signup', (req, res, next) => {
  res.render('signupPage')
})

app.post('/account/signup', (req, res, next) => {
  DBMethods.createUsersInstance(req.body.username)
    .then(() => {
      res.redirect('/')
    })
    .catch(next)
})

/*app.get('/account/changeUsername',(req,res,next) => {
  res.render('changeUsername')
})*/
