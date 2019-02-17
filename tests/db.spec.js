const { expect } = require('chai')
const seed = require('../DataAccess/seed')
const DBMethods = require('../DataAccess/db')
const { Users, Entries } = require('../DataAccess/models/index')

describe('testing database functions', () => {
  beforeEach(() => {
    return seed()
  })

  describe('GET methods', () => {
    it('getAndTransformUserEntries method gets all entries for username given as input', async () => {
      const returnValue = [
        { firstItem: 'test', secondItem: 'data' },
        { firstItem: 'larry', secondItem: 'jones' }
      ]
      const valueFromMethod = await DBMethods.getAndTransformUserEntries('erik')
      expect(valueFromMethod).to.eql(returnValue)
    })

    it('getOneEntry method gets single entry requested in input fields', async () => {
      const entryObject = await DBMethods.getOneEntry('moe', 'seed', 'item')
      const entry = await entryObject.get()
      const userObject = await Users.findOne({ where: { id: entry.userId } })
      const user = await userObject.get()
      expect(entry.firstItem).to.equal('seed')
      expect(entry.secondItem).to.equal('item')
      expect(user.username).to.equal('moe')
    })
  })

  describe('POST methods', () => {
    it('createUsersInstance adds new user to Users model', async () => {
      const newUserObject = await DBMethods.createUsersInstance('mike')
      const newUser = await newUserObject.get()
      const [allUsers, mike] = await Promise.all([
        Users.findAndCountAll(),
        Users.findOne({ where: { username: 'mike' } })
      ])

      expect(newUser.username).to.equal('mike')
      expect(mike).to.not.be.null
      expect(allUsers.count).to.equal(3)
    })

    it('createEntriesinstance adds new entry to Entries model for exisitng user', async () => {
      const entryAddedObject = await DBMethods.createEntriesInstance(
        'erik',
        'new',
        'entry'
      )
      const entryAdded = entryAddedObject.get()
      const userObject = await Users.findOne({ where: { username: 'erik' } })
      const user = await userObject.get()
      const entry = await Entries.findOne({
        where: { firstItem: 'new', secondItem: 'entry', userId: user.id }
      })
      expect(entryAdded.firstItem).to.equal('new')
      expect(entryAdded.secondItem).to.equal('entry')
      expect(entry).to.not.be.null
    })
  })

  describe('DELETE methods', () => {
    it('deleteAccount deletes requested user in Users model and all associated entries in Entries model', async () => {
      const erikUserObjectBefore = await Users.findOne({
        where: { username: 'erik' }
      })
      const erikId = await erikUserObjectBefore.get().id
      await DBMethods.deleteAccount('erik')
      const erikUserObject = await Users.findOne({
        where: { username: 'erik' }
      })
      const erikEntries = await Entries.findAndCountAll({
        where: { userId: erikId }
      })
      expect(erikUserObject).to.be.null
      expect(erikEntries.count).to.equal(0)
    })

    it('deleteEntriesInstance deletes an individual entry', async () => {
      const moeUserObject = await Users.findOne({
        where: { username: 'moe' }
      })
      const moeId = await moeUserObject.get().id
      const entryBefore = await Entries.findAndCountAll({
        where: {
          firstItem: 'seed',
          secondItem: 'item',
          userId: moeId
        }
      })
      const entryBeforeExists = entryBefore.count === 1
      await DBMethods.deleteEntriesInstance('moe', 'seed', 'item')
      const entryNow = await Entries.findAndCountAll({
        where: {
          firstItem: 'seed',
          secondItem: ' item',
          userId: moeId
        }
      })
      expect(entryBeforeExists).to.equal(true)
      expect(entryNow.count).to.equal(0)
    })
  })

  describe('UPDATE methods', () => {
    it('updateUserName changes existing username', async () => {
      const erikUserObjectBefore = await Users.findAndCountAll({
        where: { username: 'erik' }
      })
      const erikId = await erikUserObjectBefore.rows[0].get().id
      await DBMethods.updateUserName('erik', 'curly')
      const erikUserObject = await Users.findAndCountAll({
        where: { id: erikId }
      })
      const erikUser = erikUserObject.rows[0].get()
      expect(erikUserObjectBefore.count).to.equal(1)
      expect(erikUserObject.count).to.equal(1)
      expect(erikUser.username).to.equal('curly')
    })

    it('updateEntry changes individual existing entry for specificed user', async () => {
      const moeUserObject = await Users.findAndCountAll({
        where: { username: 'moe' }
      })
      const moeId = await moeUserObject.rows[0].get().id
      const entryBefore = await Entries.findAndCountAll({
        where: {
          firstItem: 'his',
          secondItem: 'chair',
          userId: moeId
        }
      })
      const entryId = await entryBefore.rows[0].get().id
      await DBMethods.updateEntry('moe', 'his', 'chair', 'changed', 'item')
      const entryObjectNow = await Entries.findAndCountAll({
        where: { id: entryId }
      })
      const entryNow = entryObjectNow.rows[0].get()
      expect(entryBefore.count).to.equal(1)
      expect(entryObjectNow.count).to.equal(1)
      expect(entryNow.firstItem).to.equal('changed')
      expect(entryNow.secondItem).to.equal('item')
    })
  })
})
