const app = require('./app')
const { dbInit, seed } = require('./DataAccess/seed')

const PORT = process.env.PORT || 3000

seed().then(() => {
  app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
})
