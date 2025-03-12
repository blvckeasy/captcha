const Jwt = require("jsonwebtoken");
const { TokenExpiredError, AttributeRequireError } = require("./errors");

class JWT {
    static secretKey = "my secret key";
    static expireIn = "2m"; // 2 minutes

    constructor() {}

    static sign(payload) {
        const token = Jwt.sign(payload, this.secretKey, {
            expiresIn: this.expireIn,
        });
        return token;
    }

    static verify(token) {
        try {
            if (!token)
                throw new AttributeRequireError("Token is required!");

            const data = Jwt.verify(token, this.secretKey);
            return data;
        } catch (error) {
            if (error instanceof AttributeRequireError) {
                throw error;
            }
            throw new TokenExpiredError("Token is expired!");
        }
    }
}

module.exports = JWT;
