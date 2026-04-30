import { expect, test } from '@playwright/test'
import { TodoAppPage } from '../pages/TodoAppPage'

const URL = 'https://todo-app.tallinn-learning.ee/'
let todoAppPage: TodoAppPage

test.beforeEach(async ({ page }) => {
  todoAppPage = new TodoAppPage(page)
  await todoAppPage.goto(URL)
})

test('should create one task', async () => {
  const taskName = 'my first task'
  await todoAppPage.createTodo(taskName)
  await todoAppPage.expectTodoVisible(taskName)
})

test('should create two todo items', async () => {
  const firstTaskName = 'task 1'
  const secondTaskName = 'task 2'
  await todoAppPage.createTodo(firstTaskName)
  await todoAppPage.createTodo(secondTaskName)
  await todoAppPage.expectTodoVisible(firstTaskName)
  await todoAppPage.expectTodoVisible(secondTaskName)
})

test('should create a task and mark it completed', async () => {
  const taskName = 'completed task'
  await todoAppPage.createTodo(taskName)
  await todoAppPage.completeTodo(taskName)

  await todoAppPage.expectTodoVisible(taskName)
})

test('should filter active tasks', async () => {
  const activeTaskName = 'active task'
  const completedTaskName = 'done task'
  await todoAppPage.createTodo(activeTaskName)
  await todoAppPage.createTodo(completedTaskName)
  await todoAppPage.completeTodo(completedTaskName)

  await todoAppPage.openActiveFilter()

  await todoAppPage.expectTodoVisible(activeTaskName)
  await todoAppPage.expectTodoHidden(completedTaskName)
})

test('should filter completed tasks', async () => {
  const activeTaskName = 'active task'
  const completedTaskName = 'done task'
  await todoAppPage.createTodo(activeTaskName)
  await todoAppPage.createTodo(completedTaskName)
  await todoAppPage.completeTodo(completedTaskName)

  await todoAppPage.openCompletedFilter()

  await todoAppPage.expectTodoVisible(completedTaskName)
  await todoAppPage.expectTodoHidden(activeTaskName)
})

test('should clear completed tasks', async () => {
  const activeTaskName = 'active task'
  const completedTaskName = 'done task'
  await todoAppPage.createTodo(activeTaskName)
  await todoAppPage.createTodo(completedTaskName)
  await todoAppPage.completeTodo(completedTaskName)

  await todoAppPage.clearCompleted()

  await todoAppPage.expectTodoVisible(activeTaskName)
  await todoAppPage.expectTodoHidden(completedTaskName)
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

  await expect(todoAppPage.findTodoItemByText(updatedTaskName)).toBeVisible()
  await expect(todoAppPage.findTodoItemByText(initialTaskName)).toBeHidden()
})

test('should delete a task', async () => {
  const taskName = 'task to delete'
  await todoAppPage.createTodo(taskName)
  await todoAppPage.deleteTodo(taskName)

  await todoAppPage.expectTodoHidden(taskName)
})
