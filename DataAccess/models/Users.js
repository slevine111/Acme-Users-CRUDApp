const connection = require('../connection')

const Users = connection.define('users', {
  username: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = Users
