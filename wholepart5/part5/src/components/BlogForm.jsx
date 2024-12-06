import { useState } from 'react'

const BlogForm = ({ createBlog, setErrorMessage }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    })
    setErrorMessage(`a new blog ${newTitle} by ${newAuthor}`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='blogFormTitle'
            type='text'
            value={newTitle}
            name='title'
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          author:
          <input
            data-testid='blogFormAuthor'
            type='text'
            value={newAuthor}
            name='author'
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          url:
          <input
            data-testid='blogFormUrl'
            type='text'
            value={newUrl}
            name='url'
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder='url'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>)
}

export default BlogForm