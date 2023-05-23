
//up = cria a tabela, tags = nome da tabela
exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id");
    table.text("name"); //não permite deixar sem nome
    
    //relacionando as tags a existência de uma nota (id da nota)
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE")
    //.onDelete("CASCADE") = Caso uma nota seja deletada, todas as tags vinculadas também serão.

    //relacionando as tags a existência de um usuário (id do usuário)
    table.integer("user_id").references("id").inTable("users")

}) 
  


//down = deleta a tabela
exports.down = knex => knex.schema.dropTable("tags");
