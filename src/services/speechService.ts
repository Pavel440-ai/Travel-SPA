/**
 * Сервис для работы с речью (Speech-to-Text и Text-to-Speech)
 */
export class SpeechService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis
  private isListening = false
  private onResultCallback?: (text: string) => void
  private onErrorCallback?: (error: string) => void

  constructor() {
    this.synthesis = window.speechSynthesis

    // Инициализация Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'ru-RU,en-US' // Поддержка русского и английского

      this.recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript && this.onResultCallback) {
          this.onResultCallback(finalTranscript.trim())
        }
      }

      this.recognition.onerror = (event) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error)
        }
      }

      this.recognition.onend = () => {
        this.isListening = false
      }
    }
  }

  /**
   * Начать распознавание речи
   */
  startListening(
    onResult: (text: string) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition не поддерживается в вашем браузере')
      return false
    }

    if (this.isListening) {
      return false
    }

    this.onResultCallback = onResult
    this.onErrorCallback = onError
    this.isListening = true

    try {
      this.recognition.start()
      return true
    } catch (error) {
      this.isListening = false
      if (onError) onError('Ошибка при запуске распознавания речи')
      return false
    }
  }

  /**
   * Остановить распознавание речи
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  /**
   * Проверить, слушает ли ассистент
   */
  getIsListening(): boolean {
    return this.isListening
  }

  /**
   * Синтез речи (Text-to-Speech)
   */
  speak(text: string, lang: string = 'ru-RU'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Останавливаем предыдущее воспроизведение
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis.speak(utterance)
    })
  }

  /**
   * Остановить синтез речи
   */
  stopSpeaking(): void {
    this.synthesis.cancel()
  }

  /**
   * Проверить поддержку Speech Recognition
   */
  isRecognitionSupported(): boolean {
    return this.recognition !== null
  }

  /**
   * Определить язык текста (простая эвристика)
   */
  detectLanguage(text: string): string {
    const cyrillicPattern = /[а-яё]/i
    return cyrillicPattern.test(text) ? 'ru-RU' : 'en-US'
  }
}

// Расширение типов для TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

