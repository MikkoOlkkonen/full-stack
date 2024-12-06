import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

vi.mock('./TogglableView', () => {
  const React = require('react')
  const MockView = ({ children, buttonLabel }) => {
    const [visible, setVisible] = React.useState(false)
    return (
      <div>
        <button onClick={() => setVisible(!visible)}>{ buttonLabel }</button>
        {visible && <div>{ children }</div>}
      </div>
    )
  }
  return { default: MockView }
})

test('renders content correctly by default', () => {

  const mockHandler = vi.fn()

  const user = {
    username: 'username',
    name: 'name',
    password: 'password'
  }

  const blog = {
    user: user,
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0
  }

  render(<Blog blog={blog} currentUser={user} addLikeToBlog={mockHandler} />)
  screen.debug()
  const element = screen.getByText('title author')
  const urlElement = screen.queryByText('url')
  const likesElement = screen.queryByText('0')
  expect(element).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('url and likes are displayed when the button is clicked', async () => {

  const mockHandler = vi.fn()

  const currentUser = {
    username: 'username',
    name: 'name',
    password: 'password'
  }

  const blog = {
    user: currentUser,
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0
  }

  render(<Blog blog={blog} currentUser={currentUser} addLikeToBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = screen.getByText('title author')
  const urlElement = screen.queryByText('url')
  const likesElement = screen.queryByText('0')
  expect(element).toBeDefined()
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()

  screen.debug()
})

test('If like is clicked twice, the event handler is called twice', async () => {

  const mockHandler = vi.fn()

  const currentUser = {
    username: 'username',
    name: 'name',
    password: 'password'
  }

  const blog = {
    user: currentUser,
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0
  }

  render(<Blog blog={blog} currentUser={currentUser} addLikeToBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

  screen.debug()
})

test('If like is clicked twice, the event handler is called twice', async () => {

  const mockHandler = vi.fn()
  const mockSetError = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm  createBlog={mockHandler} setErrorMessage={mockSetError} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  const createButton = screen.getByText('create')
  await user.type(titleInput, 'title')
  await user.type(authorInput, 'author')
  await user.type(urlInput, 'url')
  await user.click(createButton)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0
  })

  screen.debug()
})