const app = require('supertest')(require('../app'))
const { expect } = require('chai')
const { seed } = require('../DataAccess/seed')
const { Entries, Users } = require('../DataAccess/models/index')

//Entries.findAndCountAll().then(res => console.log(res))

describe('app', () => {
  before(() => seed())

  describe('GET / route', () => {
    const routeReturn = app.get('/')
    it('it has input field of type text to put in username', done => {
      routeReturn
        .expect(200)
        .then(res => {
          expect(res.text).to.match(/<input *type="text"/)
          done()
        })
        .catch(err => done(err))
    })
    it('it has form to make request to GET /user/ route', done => {
      routeReturn
        .expect(200)
        .then(res => {
          expect(res.text).to.contain('form method="GET" action="/user">')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('GET /user route', () => {
    //const routeReturn = app.get('/user?username=erik')
    it('all entries in Entries model associated to username in query string are in page in format <li>[firstItem] [secondItem]</li>', done => {
      app
        .get('/user?username=erik')
        .expect(200)
        .then(res => {
          expect(res.text.split('\n').join(' ')).to.match(/<li>.*test data/)
          expect(res.text.split('\n').join(' ')).to.match(/<li>.*larry jones/)
          done()
        })
        .catch(err => done(err))
    })
    it('it contains a form to add new entry for current username', done => {
      app
        .get('/user?username=erik')
        .expect(200)
        .then(res => {
          expect(res.text).to.match(
            /<form *method="POST" *action="\/user\?username=erik"/
          )
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /user route', () => {
    it('sends new entry to be added in an url form and then redirects to GET /user?username=[username]', done => {
      app
        .post('/user?username=moe')
        .type('form')
        .send({ firstItem: 'test' })
        .send({ secondItem: 'post' })
        .expect(302)
        .expect('location', '/user?username=moe')
        .end(err => {
          if (err) return done(err)
          return done()
        })
    })
    it('after redirect, GET /user?username=[username] page has new entry in it', done => {
      app
        .post('/user?username=moe')
        .type('form')
        .send({ firstItem: 'ty' })
        .send({ secondItem: 'tg' })
        .redirects(1)
        .expect(200)
        .then(res => {
          expect(res.text.split('\n').join(' ')).to.match(/<li>.*test post/)
          done()
        })
        .catch(err => done(err))
    })
  })

  /*describe('DELETE /user/:entryId route', async () => {
    const erikObject = await Users.findOne({ where: { username: 'erik' } })
    const erikId = await erikObject.get().id
    console.log(erikId)
    const entryobject = await Entries.findOne({
      where: { firstItem: 'larry', secondItem: 'jones', userId: erikId }
    })
    console.log('reached')

    const entryId = await entryobject.get().id
    it('it gives id of entry in Entries model to be deleted, entryId, and then redirects to GET /user?username=[username]', done => {
      app
        .delete(`/user/${entryId}?username=erik`)
        .expect(302)
        .expect('location', '/user?username=erik')
        .end(err => {
          if (err) return done(err)
          return done()
        })
    })
    it('after redirect, GET /user?username=[username] page no longer has deleted entry in it', done => {
      app
        .delete(`/user/${entryId}?username=erik`)
        .redirects(1)
        .expect(200)
        .then(res => {
          expect(res.text.split('\n').join(' ')).to.not.match(
            /<li>.*larry jones/
          )
          done()
        })
        .catch(err => done(err))
    })
  })*/

  describe('PUT /user route', () => {
    it('sends updated entry in an url form and then redirects to GET /user?username=[username]', done => {
      app
        .put('/user?username=moe')
        .type('form')
        .send({ firstItem: 'test' })
        .send({ secondItem: 'post' })
        .expect(302)
        .expect('location', '/user?username=moe')
        .end(err => {
          if (err) return done(err)
          return done()
        })
    })
    it('after redirect, GET /user?username=[username] page has new entry in it', done => {
      app
        .post('/user?username=moe')
        .type('form')
        .send({ firstItem: 'ty' })
        .send({ secondItem: 'tg' })
        .redirects(1)
        .expect(200)
        .then(res => {
          expect(res.text.split('\n').join(' ')).to.match(/<li>.*test post/)
          done()
        })
        .catch(err => done(err))
    })
  })
})
