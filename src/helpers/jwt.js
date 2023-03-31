const Jwt = require("jsonwebtoken");
const { TokenExpiredError } = require("./errors")

class JWT {
  static secretKey = "my secret key";
  static expireIn = '2m' // 2 minutes

  constructor () {
  }

  static sign (payload) {
    const token = Jwt.sign(payload, this.secretKey, {
      expiresIn: this.expireIn
    });
    return token;
  }

  static verify (token) {
    try {
      const data = Jwt.verify(token, this.secretKey);
      return data;
    } catch (error) {
      throw new TokenExpiredError(400, "Token is expired!")
    }
  }
}

module.exports = JWT