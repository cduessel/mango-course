export class UnexpectedError extends Error {
  constructor () {
    super('Algo deu errado. Tente novamente em alguns instantes.')
    this.name = 'UnexpectedError'
  }
}