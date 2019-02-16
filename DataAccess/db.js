const { Users, Entries } = require('./models/index')
const seed = require('./seed')

const getUserAndEntries = username => {
  return Users.findOne({
    where: { username: username },
    include: Entries
  })
}

const getAndTransformUserEntries = username => {
  return getUserAndEntries(username).then(user => {
    return user.entries.map(entry => ({
      firstItem: entry.get().firstItem,
      secondItem: entry.get().secondItem
    }))
  })
}

const getOneEntry = (username, firstItem, secondItem) => {
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

const createUsersInstance = username => Users.create({ username })

const createEntriesInstance = async (username, firstItem, secondItem) => {
  const newEntry = await Entries.create({ firstItem, secondItem })
  const usersInstance = await Users.findOne({ where: { username } })
  return usersInstance.addEntries(newEntry)
}

const deleteEntriesInstance = (username, firstItem, secondItem) => {
  return getOneEntry(username, firstItem, secondItem).then(entry =>
    entry.destroy()
  )
}

const deleteAccount = async username => {
  const user = await getUserAndEntries(username)
  await user.entries.forEach(entry => entry.destroy())
  return user.destroy()
}

const updateUserName = (oldUsername, newUsername) => {
  return getUserAndEntries(oldUsername).then(user =>
    user.update({ username: newUsername })
  )
}

const updateEntry = (
  username,
  oldFirstItem,
  oldSecondItem,
  newFirstItem,
  newSecondItem
) => {
  return getOneEntry(username, oldFirstItem, oldSecondItem).then(entry =>
    entry.update({ firstItem: newFirstItem, secondItem: newSecondItem })
  )
}

seed()
  .then(() => getAndTransformUserEntries('erik'))
  .then(res => console.log(res))
  .then(() => createUsersInstance('joe'))
  .then(() => createEntriesInstance('joe', 'new user', 'first item'))
  .then(() => createEntriesInstance('joe', 'new user', 'second item'))
  .then(() => createEntriesInstance('erik', 'existing', 'user'))
  .then(() => deleteEntriesInstance('joe', 'new user', 'second item'))
  .then(() => deleteAccount('erik'))
  .then(() => updateUserName('joe', 'curly'))
  .then(() => updateEntry('moe', 'his', 'chair', 'her', 'stool'))
  .then(() => getOneEntry('curly', 'new user', 'first item'))
  .then(res => console.log(res.get()))
//.then(() => Users.findOne({ where: { username: 'tyt' } }))
//.then(val => console.log(val))
