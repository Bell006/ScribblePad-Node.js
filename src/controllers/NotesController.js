const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, description, tags, links } = request.body;
        const user_id  = request.user.id;

        //cadastrando uma nota
        const [note_id] = await knex("notes").insert({
            title,
            description,
            user_id
        });

        if(links) {
            const linksInsert = links.map(link => {
                return {
                    note_id,
                    url: link
                }
            });
    
            await knex("links").insert(linksInsert);
        }

        if(tags) {
            const tagsInsert = tags.map(name => {
                return {
                    note_id,
                    name,
                    user_id
                }
            });
    
            await knex("tags").insert(tagsInsert);
        }
    
        return response.status(200).json("Nota cadastrada com sucesso!");

    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first();

        const tags = await knex("tags")
        .where({ note_id: id })
        .orderBy("name")
        .select("name")

        const links = await knex("links")
        .where({ note_id: id })
        .orderBy("created_at")
        .select("url", "created_at")

        return response.json({
            ...note,
            tags,
            links
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({ id }).delete()

        return response.json();
    }


    async index(request, response) {
        const { title, tags } = request.query;
        const user_id = request.user.id;

        let notes;

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())

            notes = await knex("tags")
                .select([
                   "notes.id",
                   "notes.title",
                   "notes.user_id",
                ])
                .where("notes.user_id", user_id)
                .whereLike("notes.title", `%${title}%`)
                .whereIn("name", filterTags) //Comparando o name das tags passadas como parâmetro com o filterTags
                .innerJoin("notes", "notes.id", "tags.note_id")
                .groupBy("notes.id")
                .orderBy("notes.title")
        } else {

            notes = await knex("notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`) //adequando a pesquisa do titulo para não precisar ser exato
                .orderBy("title")   
        }

        const userTags = await knex("tags").where({ user_id })
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }
        })
            
        return response.json(notesWithTags);
    }
};

module.exports = NotesController;