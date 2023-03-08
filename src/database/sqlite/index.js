const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
//Resolve as mudanças de ambiente
const path = require("path");

async function sqliteConnection() {
    const database = await sqlite.open({
        //local de salvamento do arquivo do banco de dados
        filename: path.resolve(__dirname, "..", "database.db"),
        driver: sqlite3.Database
    });

    return database;

}


//Utilizar a conexão no server.js
module.exports = sqliteConnection