const app = require('./app')
const dbInit = require('./DataAccess/index')

const PORT = process.env.PORT || 3000
const syncForceValue = !process.env.FORCE === 'false'

dbInit(syncForceValue).then(() => {
  app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
})
