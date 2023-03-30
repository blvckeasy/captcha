class AttributeRequireError extends Error {
  constructor(status, message) {
    super()
    this.name = 'AttributeRequireError'
    this.message = message
    this.status = status
  }
}

class TokenExpiredError extends Error {
  constructor(status, message) {
    super()
    this.name = 'TokenExpiredError'
    this.message = message
    this.status = status
  }
}

class InvalidTokenError extends Error {
  constructor(status, message) {
    super()
    this.name = 'InvalidTokenError'
    this.message = message
    this.status = status
  }
} 

class QuizNotFoundError extends Error {
  constructor(status, message) {
    super()
    this.name = 'QuizNotFoundError'
    this.message = message
    this.status = status
  }
}

module.exports = {
  AttributeRequireError,
  TokenExpiredError,
  InvalidTokenError,
  QuizNotFoundError,
}