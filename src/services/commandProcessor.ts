/**
 * Обработчик команд для Jarvis
 */
import { TaskManager } from './taskManager'
import { CodeHelper } from './codeHelper'
import { FileManager } from './fileManager'

export interface CommandResult {
  success: boolean
  message: string
  data?: any
  action?: string
}

export class CommandProcessor {
  private taskManager: TaskManager
  private codeHelper: CodeHelper
  private fileManager: FileManager

  constructor() {
    this.taskManager = new TaskManager()
    this.codeHelper = new CodeHelper()
    this.fileManager = new FileManager()
  }

  /**
   * Обработать команду пользователя
   */
  async processCommand(command: string): Promise<CommandResult> {
    const normalizedCommand = command.toLowerCase().trim()

    // Определяем язык команды
    const isRussian = /[а-яё]/i.test(command)

    // Команды для планирования и задач
    if (
      this.matches(normalizedCommand, [
        'создай задачу',
        'добавь задачу',
        'новая задача',
        'create task',
        'add task',
        'new task',
      ])
    ) {
      return this.handleCreateTask(command, isRussian)
    }

    if (
      this.matches(normalizedCommand, [
        'покажи задачи',
        'список задач',
        'мои задачи',
        'show tasks',
        'list tasks',
        'my tasks',
      ])
    ) {
      return this.handleListTasks(isRussian)
    }

    // Команды для работы с кодом
    if (
      this.matches(normalizedCommand, [
        'создай файл',
        'новый файл',
        'create file',
        'new file',
      ])
    ) {
      return this.handleCreateFile(command, isRussian)
    }

    if (
      this.matches(normalizedCommand, [
        'объясни код',
        'что делает',
        'explain code',
        'what does',
      ])
    ) {
      return this.handleExplainCode(command, isRussian)
    }

    // Команды для работы с файлами
    if (
      this.matches(normalizedCommand, [
        'открой файл',
        'покажи файл',
        'open file',
        'show file',
      ])
    ) {
      return this.handleOpenFile(command, isRussian)
    }

    // Команды для поиска
    if (
      this.matches(normalizedCommand, [
        'найди',
        'поиск',
        'find',
        'search',
      ])
    ) {
      return this.handleSearch(command, isRussian)
    }

    // Команды для времени и даты
    if (
      this.matches(normalizedCommand, [
        'который час',
        'сколько времени',
        'what time',
        'current time',
      ])
    ) {
      return this.handleTime(isRussian)
    }

    // Команды для помощи
    if (
      this.matches(normalizedCommand, [
        'помощь',
        'что ты умеешь',
        'help',
        'what can you do',
      ])
    ) {
      return this.handleHelp(isRussian)
    }

    // Команда не распознана
    return {
      success: false,
      message: isRussian
        ? 'Извините, я не понял команду. Попробуйте сказать "помощь" для списка доступных команд.'
        : "Sorry, I didn't understand the command. Try saying 'help' for a list of available commands.",
    }
  }

  /**
   * Проверка совпадения команды с паттернами
   */
  private matches(command: string, patterns: string[]): boolean {
    return patterns.some((pattern) => command.includes(pattern))
  }

  /**
   * Создать задачу
   */
  private async handleCreateTask(
    command: string,
    isRussian: boolean
  ): Promise<CommandResult> {
    // Извлекаем название задачи из команды
    const taskName = this.extractTaskName(command, isRussian)
    if (!taskName) {
      return {
        success: false,
        message: isRussian
          ? 'Пожалуйста, укажите название задачи.'
          : 'Please specify the task name.',
      }
    }

    const task = await this.taskManager.addTask(taskName)
    return {
      success: true,
      message: isRussian
        ? `Задача "${taskName}" успешно создана.`
        : `Task "${taskName}" created successfully.`,
      data: task,
    }
  }

  /**
   * Показать список задач
   */
  private async handleListTasks(isRussian: boolean): Promise<CommandResult> {
    const tasks = this.taskManager.getTasks()
    if (tasks.length === 0) {
      return {
        success: true,
        message: isRussian
          ? 'У вас нет активных задач.'
          : 'You have no active tasks.',
        data: [],
      }
    }

    const taskList = tasks.map((t) => t.name).join(', ')
    return {
      success: true,
      message: isRussian
        ? `Ваши задачи: ${taskList}`
        : `Your tasks: ${taskList}`,
      data: tasks,
    }
  }

  /**
   * Создать файл
   */
  private async handleCreateFile(
    command: string,
    isRussian: boolean
  ): Promise<CommandResult> {
    const fileName = this.extractFileName(command, isRussian)
    if (!fileName) {
      return {
        success: false,
        message: isRussian
          ? 'Пожалуйста, укажите имя файла.'
          : 'Please specify the file name.',
      }
    }

    const result = await this.codeHelper.createFile(fileName)
    return {
      success: result.success,
      message: result.message,
      data: result.data,
    }
  }

  /**
   * Объяснить код
   */
  private async handleExplainCode(
    command: string,
    isRussian: boolean
  ): Promise<CommandResult> {
    return {
      success: true,
      message: isRussian
        ? 'Для объяснения кода, пожалуйста, укажите файл или вставьте код.'
        : 'To explain code, please specify a file or paste the code.',
      action: 'explain_code',
    }
  }

  /**
   * Открыть файл
   */
  private async handleOpenFile(
    command: string,
    isRussian: boolean
  ): Promise<CommandResult> {
    const fileName = this.extractFileName(command, isRussian)
    if (!fileName) {
      return {
        success: false,
        message: isRussian
          ? 'Пожалуйста, укажите имя файла.'
          : 'Please specify the file name.',
      }
    }

    const result = await this.fileManager.openFile(fileName)
    return {
      success: result.success,
      message: result.message,
      data: result.data,
    }
  }

  /**
   * Поиск
   */
  private async handleSearch(
    command: string,
    isRussian: boolean
  ): Promise<CommandResult> {
    const query = this.extractSearchQuery(command, isRussian)
    if (!query) {
      return {
        success: false,
        message: isRussian
          ? 'Пожалуйста, укажите, что искать.'
          : 'Please specify what to search for.',
      }
    }

    return {
      success: true,
      message: isRussian
        ? `Ищу информацию о "${query}". Открываю поиск в браузере.`
        : `Searching for "${query}". Opening browser search.`,
      action: 'search',
      data: { query },
    }
  }

  /**
   * Время
   */
  private handleTime(isRussian: boolean): CommandResult {
    const now = new Date()
    const timeString = now.toLocaleTimeString(isRussian ? 'ru-RU' : 'en-US')
    const dateString = now.toLocaleDateString(isRussian ? 'ru-RU' : 'en-US')

    return {
      success: true,
      message: isRussian
        ? `Сейчас ${timeString}, ${dateString}`
        : `Current time is ${timeString}, ${dateString}`,
      data: { time: timeString, date: dateString },
    }
  }

  /**
   * Помощь
   */
  private handleHelp(isRussian: boolean): CommandResult {
    const commands = isRussian
      ? [
          '• "Создай задачу [название]" - создать новую задачу',
          '• "Покажи задачи" - показать список задач',
          '• "Создай файл [имя]" - создать новый файл',
          '• "Который час" - узнать текущее время',
          '• "Найди [запрос]" - поиск в интернете',
          '• "Помощь" - показать эту справку',
        ]
      : [
          '• "Create task [name]" - create a new task',
          '• "Show tasks" - list all tasks',
          '• "Create file [name]" - create a new file',
          '• "What time" - get current time',
          '• "Find [query]" - search the web',
          '• "Help" - show this help',
        ]

    return {
      success: true,
      message: isRussian
        ? `Доступные команды:\n${commands.join('\n')}`
        : `Available commands:\n${commands.join('\n')}`,
      data: { commands },
    }
  }

  /**
   * Извлечь название задачи из команды
   */
  private extractTaskName(command: string, isRussian: boolean): string | null {
    const patterns = isRussian
      ? ['создай задачу', 'добавь задачу', 'новая задача']
      : ['create task', 'add task', 'new task']

    for (const pattern of patterns) {
      const index = command.toLowerCase().indexOf(pattern)
      if (index !== -1) {
        const taskName = command.substring(index + pattern.length).trim()
        return taskName || null
      }
    }
    return null
  }

  /**
   * Извлечь имя файла из команды
   */
  private extractFileName(command: string, isRussian: boolean): string | null {
    const patterns = isRussian
      ? ['создай файл', 'новый файл', 'открой файл', 'покажи файл']
      : ['create file', 'new file', 'open file', 'show file']

    for (const pattern of patterns) {
      const index = command.toLowerCase().indexOf(pattern)
      if (index !== -1) {
        const fileName = command.substring(index + pattern.length).trim()
        return fileName || null
      }
    }
    return null
  }

  /**
   * Извлечь поисковый запрос из команды
   */
  private extractSearchQuery(command: string, isRussian: boolean): string | null {
    const patterns = isRussian ? ['найди', 'поиск'] : ['find', 'search']

    for (const pattern of patterns) {
      const index = command.toLowerCase().indexOf(pattern)
      if (index !== -1) {
        const query = command.substring(index + pattern.length).trim()
        return query || null
      }
    }
    return null
  }
}

