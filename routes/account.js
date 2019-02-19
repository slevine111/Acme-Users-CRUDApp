const DBMethods = require('../DataAccess/db')
const knownErrorHandler = require('../errorFunctions')
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('userAccountPage', {
    username: req.query.username,
    error: req.query.error
  })
})

router.put('/', (req, res, next) => {
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

router.delete('/', (req, res, next) => {
  DBMethods.deleteAccount(req.body.username)
    .then(() => res.redirect(`/`))
    .catch(next)
})

module.exports = router
