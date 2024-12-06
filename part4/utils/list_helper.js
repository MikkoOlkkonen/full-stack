const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum = sum + blog.likes
    })
    return sum
}

const favoriteBlog = (blogs) => {
    let maxlikes = 0
    let favorite = null
    blogs.forEach(blog => {
        if (blog.likes > maxlikes) {
            maxlikes = blog.likes
            favorite = blog
        }
    })
    return favorite
}

const mostBlogs = (blogs) => {
    const blogCounts = lodash.countBy(blogs, 'author')
    const maxPosts = lodash.maxBy(Object.entries(blogCounts), ([, count]) => count)
    const retval = {
        'author': maxPosts[0],
        'blogs': maxPosts[1]
    }
    return retval
}

const mostLikes = (blogs) => {
    const blogsByAuthor = lodash.groupBy(blogs, 'author')
    const likesByAuthor = lodash.map(blogsByAuthor, (authorBlogs, author) => ({
        'author': author,
        'likes': lodash.sumBy(authorBlogs, 'likes')
    }))
    const maxLikes = lodash.maxBy(likesByAuthor, 'likes')
    return maxLikes
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}