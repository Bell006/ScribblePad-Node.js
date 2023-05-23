
//up = cria a tabela, links = nome da tabela
exports.up = knex => knex.schema.createTable("links", table => {
    table.increments("id");
    
    //relacionando os links a existência de uma nota (id da nota)
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    //.onDelete("CASCADE") = Caso uma nota seja deletada, todos os links vinculadas também serão.

    table.text("url");
    table.timestamp("created_at").default(knex.fn.now());

}) 
  


//down = deleta a tabela
exports.down = knex => knex.schema.dropTable("links");
