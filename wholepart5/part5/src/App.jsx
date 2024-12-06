import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/notification'
import LoginForm from './components/loginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import SingupForm from './components/signupForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [signupVisible, setSignupVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addLikeToBlog = async(blog) => {
    const updatedBlog = { user: blog.user,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
  }

  const removeBlog = async (blogToRemove) => {
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)) {
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setLoginVisible(false)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    const allUsers = await userService.getAll()
    let alreadyUsed = false

    allUsers.forEach(user => {
      if (user.username === username) {
        alreadyUsed = true
      }
    })
    if (alreadyUsed) {
      setUsername('')
      setPassword('')
      setErrorMessage('username in use already')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
    else {
      const newUser = {
        username: username,
        name: '',
        password: password
      }
      const createdUser = await userService.create(newUser)
      console.log(createdUser)
      handleLogin(event)
    }
  }
  const loginForm = () => {
    const hideWhenLoginVisible = { display: loginVisible ? 'none' : '' }
    const showWhenLoginVisible = { display: loginVisible ? '' : 'none' }

    const hideWhenSignupVisible = { display: signupVisible ? 'none' : '' }
    const showWhenSignupVisible = { display: signupVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenLoginVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={hideWhenSignupVisible}>
          <button onClick={() => setSignupVisible(true)}>sign up</button>
        </div>
        <div style={showWhenLoginVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
        <div style={showWhenSignupVisible}>
          <SingupForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleSignup}
          />
          <button onClick={() => setSignupVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  return (
    <div>
      <h1>MyBlogs</h1>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        {user.username} logged in<button onClick={logout}>logout</button>
        <Togglable buttonLabel='create  new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={addBlog}
            setErrorMessage={setErrorMessage}
          />
        </Togglable>

        {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLikeToBlog={addLikeToBlog}
            currentUser={user}
            removeBlog={removeBlog}
          />
        )}
      </div>
      }
    </div>
  )
}

export default App