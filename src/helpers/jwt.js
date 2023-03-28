const Jwt = require("jsonwebtoken");

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
    const data = Jwt.verify(token, this.secretKey);
    return data;
  }
}

module.exports = JWT