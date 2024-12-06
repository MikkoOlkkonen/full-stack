import TogglableView from './TogglableView'
import BlogInfo from './BlogInfo'

const Blog = ({ blog, addLikeToBlog, currentUser, removeBlog }) => (
  <div className='blog'>
    {blog.title} {blog.author}
    <TogglableView buttonLabel='view'>
      <BlogInfo blog={blog}
        addLikeToBlog={addLikeToBlog}
        currentUser={currentUser}
        removeBlog={removeBlog}
      />
    </TogglableView>
  </div>)

export default Blog