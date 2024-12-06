const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('loginUsername').fill(username)
    await page.getByTestId('loginPassword').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }
  
  const createBlog = async (page, content) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('blogFormTitle').fill(content.title)
    await page.getByTestId('blogFormAuthor').fill(content.author)
    await page.getByTestId('blogFormUrl').fill(content.url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(`${content.title} ${content.author}`).waitFor()
  }
  
  export { loginWith, createBlog }