/**
 * Помощник для работы с кодом
 */

export interface CodeFile {
  name: string
  content: string
  type: string
}

export class CodeHelper {
  /**
   * Создать файл
   */
  async createFile(fileName: string): Promise<{
    success: boolean
    message: string
    data?: CodeFile
  }> {
    // Определяем тип файла по расширению
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    const defaultContent = this.getDefaultContent(extension)

    const file: CodeFile = {
      name: fileName,
      content: defaultContent,
      type: extension,
    }

    // В реальном приложении здесь была бы логика создания файла
    // Для демонстрации просто возвращаем объект файла

    return {
      success: true,
      message: `Файл "${fileName}" готов к созданию.`,
      data: file,
    }
  }

  /**
   * Получить содержимое по умолчанию для типа файла
   */
  private getDefaultContent(extension: string): string {
    const templates: Record<string, string> = {
      js: "// JavaScript file\nconsole.log('Hello, World!');\n",
      ts: "// TypeScript file\nconsole.log('Hello, World!');\n",
      vue: "<template>\n  <div>\n    <!-- Your component here -->\n  </div>\n</template>\n\n<script setup lang=\"ts\">\n// Your script here\n</script>\n",
      html: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Document</title>\n</head>\n<body>\n  <!-- Your content here -->\n</body>\n</html>\n",
      css: "/* CSS file */\nbody {\n  margin: 0;\n  padding: 0;\n}\n",
      py: "# Python file\nprint('Hello, World!')\n",
      json: "{\n  \"key\": \"value\"\n}\n",
      md: "# Markdown file\n\nYour content here.\n",
    }

    return templates[extension] || `// ${extension.toUpperCase()} file\n`
  }

  /**
   * Объяснить код
   */
  async explainCode(code: string): Promise<string> {
    // Простой анализ кода (в реальном приложении можно использовать AI)
    const lines = code.split('\n').length
    const hasFunctions = /function|const\s+\w+\s*=|def\s+\w+/.test(code)
    const hasClasses = /class\s+\w+/.test(code)

    let explanation = `Код содержит ${lines} строк. `
    if (hasFunctions) explanation += 'Содержит функции. '
    if (hasClasses) explanation += 'Содержит классы. '

    return explanation || 'Не удалось проанализировать код.'
  }
}

