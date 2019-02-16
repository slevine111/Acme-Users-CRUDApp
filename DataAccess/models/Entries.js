const connection = require('../connection')

const Entries = connection.define('entries', {
  firstItem: {
    type: connection.Sequelize.STRING,
    allowNull: false
  },
  secondItem: {
    type: connection.Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Entries
