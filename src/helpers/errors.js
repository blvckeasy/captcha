class AttributeRequireError extends Error {
  constructor(status, message) {
      super()
      this.name = 'AttributeRequireError'
      this.message = message
      this.status = status
  }
}


module.exports = {
  AttributeRequireError
}