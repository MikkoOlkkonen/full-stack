const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('Tests before users were added', async () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  
  test('6 blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 6)
  })
  
  
  test('the unique identifier is id and not __id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
  
  test('POST works', async () => {

    const user = {
      username: 'fiukka',
      name: 'fiia',
      password: 'fiia123'
    }

    await api.post('/api/users').send(user).expect(201)

    const loginResponse = await api.post('/api/login').send({ username: user.username, password: user.password })

    const blog = {
      title: 'Mikon hauska blogi',
      author: 'Mikko',
      url: 'http://norttiappi.fly.dev',
      likes: 110
    }
    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(blog.title, response.body.title)
    assert.strictEqual(blog.author, response.body.author)
    assert.strictEqual(blog.url, response.body.url)
    assert.strictEqual(blog.likes, response.body.likes)
  
    const response2 = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.strictEqual(response2.body.length, 7)
  })
  
  test('likes default is 0', async () => {
    const user = {
      username: 'fiukka',
      name: 'fiia',
      password: 'fiia123'
    }

    await api.post('/api/users').send(user).expect(201)

    const loginResponse = await api.post('/api/login').send({ username: user.username, password: user.password })

    const blog = {
      title: 'Mikon hauska blogi',
      author: 'Mikko',
      url: 'http://norttiappi.fly.dev'
    }
    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 0)
  })
  
  test('missing title or url in request lead to bad request 400', async () => {
    const user = {
      username: 'fiukka',
      name: 'fiia',
      password: 'fiia123'
    }

    await api.post('/api/users').send(user).expect(201)

    const loginResponse = await api.post('/api/login').send({ username: user.username, password: user.password })


    const blog1 = {
      author: 'Mikko',
      url: 'http://norttiappi.fly.dev',
      likes: 110
    }
    const blog2 = {
      title: 'Mikon hauska blogi',
      author: 'Mikko',
      likes: 110
    }
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog1)
      .expect(400)
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog2)
      .expect(400)
  })
  
  test('test deleting a blog', async () => {
    const user = {
      username: 'fiukka',
      name: 'fiia',
      password: 'fiia123'
    }

    await api.post('/api/users').send(user).expect(201)

    const loginResponse = await api.post('/api/login').send({ username: user.username, password: user.password })

    const blog = {
      title: 'Mikon hauska blogi',
      author: 'Mikko',
      url: 'http://norttiappi.fly.dev',
      likes: 110
    }
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const blogs = await helper.blogsInDb()
    const idToDelete = blogs[blogs.length-1].id
    
    const lengthInStart = blogs.length

    await api.delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(204)
    
    const usersInEnd = await helper.blogsInDb()

    const lengthInEnd = usersInEnd.length
    assert.strictEqual(lengthInStart, lengthInEnd + 1)
  })
  
  test('updating likes of the first blog', async () => {
    const user = {
      username: 'fiukka',
      name: 'fiia',
      password: 'fiia123'
    }

    await api.post('/api/users').send(user).expect(201)

    const loginResponse = await api.post('/api/login').send({ username: user.username, password: user.password })



    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blogToUpdate = blogs[0]
    const idToUpdate = blogToUpdate.id
  
    await api.put(`/api/blogs/${idToUpdate}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 111
      })
  
    const response2 = await api.get(`/api/blogs/${idToUpdate}`)
    assert.strictEqual(response2.body.likes, 111)
  })
})




describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})


describe('test adding invalid users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('adding user with length of username below 3', async () => {
    const user = {
      username: 'mi',
      name: 'mikko',
      password: 'qweqweqwe'
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'username should be at least 3 characters long')
  })

  test('adding user with undefined username', async () => {
    const user = {
      name: 'mikko',
      password: 'qweqweqwe'
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'username should be at least 3 characters long')
  })

  test('adding user with password length below 3', async () => {
    const user = {
      username: 'mikkohehehe',
      name: 'mikko',
      password: 'qw'
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'password should be at least 3 characters long')
  })

  test('adding user with undefined password', async () => {
    const user = {
      username: 'mikkohehehe',
      name: 'mikko',
    }
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'password should be at least 3 characters long')
  })
})

describe('test adding more blogs', async () => {
  test('test adding blog without authorization', async () => {
    const blog = {
      title: 'Mikon hauska blogi',
      author: 'Mikko',
      url: 'http://norttiappi.fly.dev',
      likes: 110
    }
    await api.post('/api/blogs')
      .send(blog)
      .expect(401)
  })
})


after(async () => {
  await mongoose.connection.close()
})