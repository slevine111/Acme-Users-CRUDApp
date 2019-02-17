const Sequelize = require('sequelize')

const databaseURL =
  process.env.DATABASE_URL || 'postgres://localhost/acme-users-crud-app'

const connection = new Sequelize(databaseURL, {
  logging: false,
  define: {
    freezeTableName: true
  }
})

module.exports = connection
