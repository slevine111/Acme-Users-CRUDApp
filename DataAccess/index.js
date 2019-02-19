const connection = require('./connection')
const { Users, Entries } = require('./models/index')

const dbInit = force => {
  return connection
    .authenticate()
    .then(() => Promise.all([Entries.belongsTo(Users), Users.hasMany(Entries)]))
    .then(() => connection.sync({ force: force }))
}

module.exports = dbInit
