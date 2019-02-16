const connection = require('./connection')
const { Users, Entries } = require('./models/index')

const dbInit = () => {
  return connection
    .authenticate()
    .then(() => Promise.all([Entries.belongsTo(Users), Users.hasMany(Entries)]))
    .then(() => connection.sync({ force: true }))
}

const createSeedInstances = (model, data) => {
  return Promise.all(data.map(item => model.create(item)))
}

const seed = async () => {
  await dbInit()
  const seedUsers = [{ username: 'erik' }, { username: 'moe' }]
  const seedEntries = [
    { firstItem: 'test', secondItem: 'data' },
    { firstItem: 'seed', secondItem: 'item' },
    { firstItem: 'larry', secondItem: 'jones' },
    { firstItem: 'his', secondItem: 'chair' }
  ]
  let [
    [erik, moe],
    [entryOne, entryTwo, entryThree, entryFour]
  ] = await Promise.all([
    createSeedInstances(Users, seedUsers),
    createSeedInstances(Entries, seedEntries)
  ])

  return Promise.all([
    erik.setEntries([entryOne, entryThree]),
    moe.setEntries([entryTwo, entryFour])
  ])
}

module.exports = seed
