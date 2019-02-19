const DBMethods = require('../DataAccess/db')
const knownErrorHandler = require('../errorFunctions')
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('signupPage', { error: req.query.error })
})

router.post('/', (req, res, next) => {
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

module.exports = router
