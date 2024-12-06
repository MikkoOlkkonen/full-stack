import blogService from '../services/blogs'

const BlogInfo = ({ blog, addLikeToBlog, currentUser, removeBlog }) => {
  if (blog.user) {
    return (
      <div>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={() => addLikeToBlog(blog)}>like</button>
        </div>
        <div>{blog.user.username}</div>
        {blog.user.username === currentUser.username &&
          <button onClick={() => removeBlog(blog)}>delete</button>}
      </div>)
  }
}
export default BlogInfo