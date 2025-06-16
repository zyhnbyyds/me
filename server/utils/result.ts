export class Result<T> {
  code: number
  message: string
  data: T | null

  constructor(code: number, message: string, data: T) {
    this.code = code
    this.message = message
    this.data = data
  }

  static success<T>(data: T): Result<T> {
    return new Result(200, 'ok', data)
  }

  static ok() {
    return new Result(200, 'ok', null)
  }

  static fail(code: number, message: string) {
    return new Result(code, message, null)
  }
}
