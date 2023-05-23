const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthentication (request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("JWT Token não informado", 401)
    }

    //"Bearer xxxxx" = Omitindo o primeiro elemento e armazenando o segundo (token)
    const [, token] = authHeader.split(" ");

    try {
        const {sub: user_id} = verify(token, authConfig.jwt.secret);

        request.user = {
            id: user_id
        };

        return next()
    } catch {
        throw new AppError("JWT Token inválido.", 401)
    }
}

module.exports = ensureAuthentication;