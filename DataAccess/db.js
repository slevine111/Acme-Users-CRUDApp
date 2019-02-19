const { Users, Entries } = require('./models/index')

class DBMethods {
  static findAndThrowErrorIfUserExists(username) {
    return Users.findOne({ where: { username } }).then(user => {
      if (user !== null)
        throw new Error('Username already exists. Pick a different username')
    })
  }

  static throwErrorIfEntryNotAllowed(username, firstItem, secondItem) {
    return new Promise((resolve, reject) => {
      if ([firstItem, secondItem].includes(''))
        return reject(Error('Must enter non-empty values for both items'))
      resolve()
    })
      .then(() => this.getOneEntry(username, firstItem, secondItem))
      .then(result => {
        if (result !== null) throw new Error('You have already this entry')
      })
  }

  static getAllUsers() {
    return Users.findAll().then(users => users.map(user => user.get().username))
  }

  static getUserAndEntries(username) {
    return Users.findOne({
      where: { username: username },
      include: Entries
    }).then(data => {
      if (data === null) throw new RangeError('user does not exist')
      return data
    })
  }

  static getAndTransformUserEntries(username) {
    return this.getUserAndEntries(username).then(user => {
      return user.entries
        .map(entry => ({
          entryId: entry.get().id,
          firstItem: entry.get().firstItem,
          secondItem: entry.get().secondItem
        }))
        .sort((a, b) => a.entryId - b.entryId)
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
    return this.findAndThrowErrorIfUserExists(username).then(() =>
      Users.create({ username })
    )
  }

  static createEntriesInstance(username, firstItem, secondItem) {
    return this.throwErrorIfEntryNotAllowed(username, firstItem, secondItem)
      .then(() => {
        return Promise.all([
          Entries.create({ firstItem, secondItem }),
          Users.findOne({ where: { username } })
        ])
      })
      .then(([newEntry, usersInstance]) => newEntry.setUser(usersInstance))
  }

  static deleteEntriesInstance(username, firstItem, secondItem) {
    return this.getOneEntry(username, firstItem, secondItem).then(entry =>
      entry.destroy()
    )
  }

  static deleteEntriesInstanceById(entryId) {
    return Entries.destroy({ where: { id: entryId } })
  }

  static async deleteAccount(username) {
    const user = await this.getUserAndEntries(username)
    await user.entries.forEach(entry => entry.destroy())
    return user.destroy()
  }

  static updateUserName(oldUsername, newUsername) {
    return this.findAndThrowErrorIfUserExists(newUsername)
      .then(() => this.getUserAndEntries(oldUsername))
      .then(user => user.update({ username: newUsername }))
  }

  static updateEntriesInstanceById(
    username,
    entryId,
    newFirstItem,
    newSecondItem
  ) {
    return this.throwErrorIfEntryNotAllowed(
      username,
      newFirstItem,
      newSecondItem
    )
      .then(() => Entries.findOne({ where: { id: entryId } }))
      .then(entry => {
        return entry.update({
          firstItem: newFirstItem,
          secondItem: newSecondItem
        })
      })
  }
}

module.exports = DBMethods
