class AttributeRequireError extends Error {
  constructor(message) {
    super()
    this.name = 'AttributeRequireError'
    this.message = message
    this.status = -10000
  }
}

class TokenExpiredError extends Error {
  constructor(message) {
    super()
    this.name = 'TokenExpiredError'
    this.message = message
    this.status = -20000
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super()
    this.name = 'InvalidTokenError'
    this.message = message
    this.status = -20001
  }
} 

class QuizNotFoundError extends Error {
  constructor(message) {
    super()
    this.name = 'QuizNotFoundError'
    this.message = message
    this.status = -30000
  }
}

module.exports = {
  AttributeRequireError,
  TokenExpiredError,
  InvalidTokenError,
  QuizNotFoundError,
}