const DBMethods = require('../DataAccess/db')
const knownErrorHandler = require('../errorFunctions')
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  DBMethods.getAndTransformUserEntries(req.query.username)
    .then(entries => {
      res.render('mainPage', {
        username: req.query.username,
        entries,
        error: req.query.error,
        changingEntry: req.query.changingEntry,
        entryId: req.query.entryId,
        oldfirstitem: req.query.oldfirstitem,
        oldseconditem: req.query.oldseconditem
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

router.post('/', (req, res, next) => {
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

router.delete('/:entryId', (req, res, next) => {
  DBMethods.deleteEntriesInstanceById(Number(req.params.entryId))
    .then(() => res.redirect(`/user?username=${req.query.username}`))
    .catch(next)
})

router.put('/:entryId', (req, res, next) => {
  DBMethods.updateEntriesInstanceById(
    req.query.username,
    Number(req.params.entryId),
    req.body.firstItemNew,
    req.body.secondItemNew
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
        }&changingEntry=true&entryId=${req.params.entryId}
        &oldfirstitem=${req.query.firstitem}&oldseconditem=${
          req.query.seconditem
        }`,
        err,
        res,
        next
      )
    )
})

module.exports = router
