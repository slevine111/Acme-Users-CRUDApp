const handlerForKnownErrors = (knownErrors, redirectRoute, err, res, next) => {
  if (knownErrors.includes(err.message)) {
    return res.redirect(redirectRoute)
  }
  return next(err)
}

module.exports = handlerForKnownErrors
