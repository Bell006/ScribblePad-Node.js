const path = require("path")

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    //SQLite por padrão desativa o recurso de deletar em cascata, ativando:
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    useNullAsDefault: true, //permite a criação de colunas com o valor null no SQLite
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    }
  }

};
