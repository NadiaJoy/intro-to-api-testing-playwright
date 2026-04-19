import { expect, test } from '@playwright/test'
import { TodoAppPage } from '../pages/TodoAppPage'

const URL = 'https://todo-app.tallinn-learning.ee/'
let todoAppPage: TodoAppPage

test.beforeEach(async ({ page }) => {
  todoAppPage = new TodoAppPage(page)
  await todoAppPage.goto(URL)
})

test('should create one task', async () => {
  await todoAppPage.createTodo('my first task')

  await todoAppPage.expectTodoVisible('my first task')
})

test('should create two todo items', async () => {
  await todoAppPage.createTodo('task 1')
  await todoAppPage.createTodo('task 2')

  await todoAppPage.expectTodoVisible('task 1')
  await todoAppPage.expectTodoVisible('task 2')
})

test('should create a task and mark it completed', async () => {
  await todoAppPage.createTodo('completed task')
  await todoAppPage.completeTodo('completed task')

  await todoAppPage.expectTodoVisible('completed task')
})

test('should filter active tasks', async () => {
  await todoAppPage.createTodo('active task')
  await todoAppPage.createTodo('done task')
  await todoAppPage.completeTodo('done task')

  await todoAppPage.openActiveFilter()

  await todoAppPage.expectTodoVisible('active task')
  await todoAppPage.expectTodoHidden('done task')
})

test('should filter completed tasks', async () => {
  await todoAppPage.createTodo('active task')
  await todoAppPage.createTodo('done task')
  await todoAppPage.completeTodo('done task')

  await todoAppPage.openCompletedFilter()

  await todoAppPage.expectTodoVisible('done task')
  await todoAppPage.expectTodoHidden('active task')
})

test('should clear completed tasks', async () => {
  await todoAppPage.createTodo('active task')
  await todoAppPage.createTodo('done task')
  await todoAppPage.completeTodo('done task')

  await todoAppPage.clearCompleted()

  await todoAppPage.expectTodoVisible('active task')
  await todoAppPage.expectTodoHidden('done task')
})

test('should support long task text', async () => {
  const longTask = 'a'.repeat(150)

  await todoAppPage.createTodo(longTask)

  await todoAppPage.expectTodoVisible(longTask)
})

test('should rename a task', async () => {
  const initialTaskName = 'my task name'
  const updatedTaskName = 'my task name updated'

  await todoAppPage.createTodo(initialTaskName)
  await todoAppPage.renameTodo(initialTaskName, updatedTaskName)

  await expect(todoAppPage.todoItem(updatedTaskName)).toBeVisible()
  await expect(todoAppPage.todoItem(initialTaskName)).toBeHidden()
})

test('should delete a task', async () => {
  await todoAppPage.createTodo('task to delete')
  await todoAppPage.deleteTodo('task to delete')

  await todoAppPage.expectTodoHidden('task to delete')
})
