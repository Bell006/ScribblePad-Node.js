
//up = cria a tabela, notes = nome da tabela
exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description"); //tipo texto
    //relacionando as notas a existência de um usuário (id do usuário)
    table.integer("user_id").references("id").inTable("users")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
}) 
  


//down = deleta a tabela
exports.down = knex => knex.schema.dropTable("notes");
