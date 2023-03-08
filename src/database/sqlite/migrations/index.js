const sqlConnection = require('../../sqlite')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');


const createUsers = require('./createUsers')

async function migrationsRun() {
    //reunindo as tabelas e futuras tabelas em um objeto
    const schemas = [
        createUsers,
    ].join(''); //juntando todas elas

    sqlConnection().then(db => db.exec(schemas))
    .catch(error => console.log(error));

}

module.exports = migrationsRun;