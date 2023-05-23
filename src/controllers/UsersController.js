//Função do bcrypt que vai gerar a criptografia das senhas
const { hash, compare } = require("bcryptjs")

const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection()

        //verificando se o email já existe no banco de dados
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExists) {
            throw new AppError("Esse email já está em uso.")
        }

        //parâmetros: senha e fator de complexidade da criptografia
        const hashedPassword = await hash(password, 8)

        //salvando dados de novos usuários no database
        await database.run
        ("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
        );

        return response.status(201).json("Usuário cadastrado com sucesso!")
    }

    async update(request, response) {
        
        const { name, email, avatar, password, old_password } = request.body;
        
        const id = request.user.id;

        //conectando com o banco de dados
        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if(!user) {
            throw new AppError("Usuário não encontrado.")
        }

        const newUsersEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(newUsersEmail && newUsersEmail.id !== user.id) {
            throw new AppError("Esse email já está em uso.")
        }

        //nullish operator
        //caso não seja informado o user ou o email, manter o antigo
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.avatar = avatar ?? user.avatar;

        if(password && !old_password) {
            throw new AppError("Você precisa informar sua senha antiga para definir uma nova.")
        }

        if(password && old_password) {
            //Comparando a senha antiga fornecida com a do database
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere.")
            }

            user.password = await hash(password, 8)
        }

        await database.run(
            `UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            avatar = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user.avatar, id]
        );

        return response.status(200).json(user);
    }
}

module.exports = UsersController;