/**
 * Менеджер задач для Jarvis
 */

export interface Task {
  id: string
  name: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

export class TaskManager {
  private tasks: Task[] = []
  private storageKey = 'jarvis_tasks'

  constructor() {
    this.loadTasks()
  }

  /**
   * Добавить задачу
   */
  async addTask(name: string): Promise<Task> {
    const task: Task = {
      id: this.generateId(),
      name: name.trim(),
      completed: false,
      createdAt: new Date(),
    }

    this.tasks.push(task)
    this.saveTasks()
    return task
  }

  /**
   * Получить все задачи
   */
  getTasks(): Task[] {
    return [...this.tasks]
  }

  /**
   * Получить активные задачи
   */
  getActiveTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed)
  }

  /**
   * Завершить задачу
   */
  completeTask(id: string): boolean {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      task.completed = true
      task.completedAt = new Date()
      this.saveTasks()
      return true
    }
    return false
  }

  /**
   * Удалить задачу
   */
  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.tasks.splice(index, 1)
      this.saveTasks()
      return true
    }
    return false
  }

  /**
   * Сохранить задачи в localStorage
   */
  private saveTasks(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasks))
    } catch (error) {
      console.error('Ошибка при сохранении задач:', error)
    }
  }

  /**
   * Загрузить задачи из localStorage
   */
  private loadTasks(): void {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Восстанавливаем даты
        this.tasks = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }))
      }
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error)
      this.tasks = []
    }
  }

  /**
   * Генерация уникального ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

