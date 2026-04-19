import {expect, Locator, Page} from '@playwright/test'

export class TodoAppPage {
  readonly page: Page
  readonly todoInput: Locator
  readonly completedLink: Locator
  readonly activeLink: Locator
  readonly clearBtn: Locator
  readonly deleteBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.todoInput = page.getByTestId('text-input')
    this.completedLink = page.getByRole('link', { name: 'completed' })
    this.activeLink = page.getByRole('link', { name: 'active' })
    this.clearBtn = page.getByRole('button', { name: 'clear completed' })
    this.deleteBtn = page.locator('..').getByTestId('todo-item-button')
  }

  async goto(url: string) {
    await this.page.goto(url)
  }

  async createTodo(title: string) {
    await this.todoInput.fill(title)
    await this.todoInput.press('Enter')
  }

  todoItem(title: string) {
    return this.page.getByText(title, { exact: true })
  }

  // find element with exact text -> find its parent ->
  // and get its toggle (not the best practice, just for learning purpose)
  todoToggleByTitle(title: string) {
    return this.page
      .getByText(title, { exact: true })
      .locator('..')
      .getByTestId('todo-item-toggle')
  }

  // use 'hover' to see hidden X button
  async deleteTodo(title: string) {
    const todo = this.todoItem(title)
    await todo.hover()
    await todo.locator('..').getByTestId('todo-item-button').click()

  }

  async completeTodo(title: string) {
    await this.todoToggleByTitle(title).check()
  }

  async openCompletedFilter() {
    await this.completedLink.click()
  }

  async openActiveFilter() {
    await this.activeLink.click()
  }

  async clearCompleted() {
    await this.clearBtn.click()
  }

  async expectTodoVisible(title: string) {
    await expect(this.todoItem(title)).toBeVisible()
  }

  async expectTodoHidden(title: string) {
    await expect(this.todoItem(title)).toBeHidden()
  }

  async renameTodo(oldTitle: string, newTitle: string) {
    await this.todoItem(oldTitle).dblclick()
    await this.page.getByTestId('todo-item').getByTestId('text-input').fill(newTitle)
    await this.page.getByTestId('todo-item').getByTestId('text-input').press('Enter')
  }
}
