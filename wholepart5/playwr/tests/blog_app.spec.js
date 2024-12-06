const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Mikko',
        username: 'mikkoe',
        password: 'mikkolol'
      }
    })
    await request.post('/api/users', {
        data: {
          name: 'Venla',
          username: 'venlaee',
          password: 'rotta'
        }
      })
    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByText('log in').click()

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByTestId('loginUsername')).toBeVisible()
    await expect(page.getByTestId('loginPassword')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login'})).toBeVisible()
    await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mikkoe', 'mikkolol')
      await expect(page.getByText('mikkoe logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mikkoe', 'mikko')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mikkoe', 'mikkolol')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'title1',
        author: 'author1',   
        url: 'url1'
      })
      await expect(page.getByText('title1 author1')).toBeVisible()
    })
    
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'title2',
        author: 'author2',   
        url: 'url2'
      })
    
      const viewButton = page.getByText('view')
      await viewButton.click()
      const likeButton = page.getByText('like')
      await likeButton.click()
      const likeCount = page.getByText('1')
      await expect(likeCount).toBeVisible()
    })

    test('the user who made the post can also delete it', async ({ page }) => {
      await createBlog(page, {
        title: 'title3',
        author: 'author3',   
        url: 'url33'
      })
    
      const viewButton = page.getByText('view')
      await viewButton.click()
      const deleteButton = page.getByText('delete')
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        console.log(dialog.message())
        await dialog.accept()
      })
      await deleteButton.click()
      await expect(page.getByText('title3 author3')).not.toBeVisible()
    })

    test('Only the user who added the blog sees the delete button', async ({ page }) => {
      await createBlog(page, {
        title: 'title3',
        author: 'author3',   
        url: 'url33'
      })

      const logoutButton = page.getByText('logout')
      await logoutButton.click()

      await loginWith(page, 'venlaee', 'rotta')
    
      const viewButton = page.getByText('view')
      await viewButton.click()

      const deleteButton = page.getByText('delete')
      await expect(deleteButton).not.toBeVisible()
    })

    test('The blogs are shown in a descending order by their likes', async ({ page }) => {
      await createBlog(page, {
        title: 'title1',
        author: 'author1',   
        url: 'url1'
      })
      await createBlog(page, {
        title: 'title2',
        author: 'author2',   
        url: 'url2'
      })
      await createBlog(page, {
        title: 'title3',
        author: 'author3',   
        url: 'url3'
      })

      const likeBlog = async (title, likeCount) => {
        const blogSelector = page.locator('.blog', { hasText: title })
        await blogSelector.getByRole('button', { name: 'view' }).click()
    
        const likeButton = blogSelector.getByRole('button', { name: 'like' })
        for (let i = 0; i < likeCount; i++) {
          await likeButton.click()
        }
      }

      await likeBlog('title1', 1)
      await likeBlog('title2', 10)
      await likeBlog('title3', 5)

      const blogTitles = page.locator('.blog')
      const blogs = await blogTitles.allTextContents()

      const likes = blogs.map(blog => {
        const match = blog.match(/(\d+) like/)
        return match ? parseInt(match[1], 10) : 0
      })

      for (let i = 0; i < likes.length-1; i++) {
        expect(likes[i]).toBeGreaterThanOrEqual(likes[i+1])
      }
    })
  })
})