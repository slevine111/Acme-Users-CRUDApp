const { Users, Entries } = require('./models/index')
const seed = require('./seed')

class DBMethods {
  static getUserAndEntries(username) {
    return Users.findOne({
      where: { username: username },
      include: Entries
    })
  }

  static getAndTransformUserEntries(username) {
    return this.getUserAndEntries(username).then(user => {
      return user.entries.map(entry => ({
        firstItem: entry.get().firstItem,
        secondItem: entry.get().secondItem
      }))
    })
  }

  static getOneEntry(username, firstItem, secondItem) {
    return Users.findOne({ where: { username } })
      .then(usersInstance => usersInstance.get().id)
      .then(userId =>
        Entries.findOne({
          where: {
            userId,
            firstItem: firstItem,
            secondItem: secondItem
          }
        })
      )
  }

  static createUsersInstance(username) {
    return Users.create({ username })
  }

  static async createEntriesInstance(username, firstItem, secondItem) {
    const [newEntry, usersInstance] = await Promise.all([
      Entries.create({ firstItem, secondItem }),
      Users.findOne({ where: { username } })
    ])
    await newEntry.setUser(usersInstance)
    return newEntry
  }

  static deleteEntriesInstance(username, firstItem, secondItem) {
    return this.getOneEntry(username, firstItem, secondItem).then(entry =>
      entry.destroy()
    )
  }

  static async deleteAccount(username) {
    const user = await this.getUserAndEntries(username)
    await user.entries.forEach(entry => entry.destroy())
    return user.destroy()
  }

  static updateUserName(oldUsername, newUsername) {
    return this.getUserAndEntries(oldUsername).then(user =>
      user.update({ username: newUsername })
    )
  }

  static updateEntry(
    username,
    oldFirstItem,
    oldSecondItem,
    newFirstItem,
    newSecondItem
  ) {
    return this.getOneEntry(username, oldFirstItem, oldSecondItem).then(entry =>
      entry.update({ firstItem: newFirstItem, secondItem: newSecondItem })
    )
  }
}

module.exports = DBMethods

/*seed()
  .then(() => DBMethods.getAndTransformUserEntries('erik'))
  .then(res => console.log(res))
  .then(() => DBMethods.createUsersInstance('joe'))
  .then(() => DBMethods.createEntriesInstance('joe', 'new user', 'first item'))
  .then(() => DBMethods.createEntriesInstance('joe', 'new user', 'second item'))
  .then(() => DBMethods.createEntriesInstance('erik', 'existing', 'user'))
  .then(() => DBMethods.deleteEntriesInstance('joe', 'new user', 'second item'))
  .then(() => DBMethods.deleteAccount('erik'))
  .then(() => DBMethods.updateUserName('joe', 'curly'))
  .then(() => DBMethods.updateEntry('moe', 'his', 'chair', 'her', 'stool'))
  .then(() => DBMethods.getOneEntry('curly', 'new user', 'first item'))
  .then(res => console.log(res))
//.then(() => Users.findOne({ where: { username: 'tyt' } }))
//.then(val => console.log(val))*/
