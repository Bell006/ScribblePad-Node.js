//File responsible for all routes

const { Router } = require("express")

const routes = Router()

//Contain all routes
const usersRouter = require("./users.routes")
const notesRouter = require("./notes.routes")
const tagsRouter = require("./tags.routes")

routes.use("/users", usersRouter)
routes.use("/notes", notesRouter)
routes.use("/tags", tagsRouter)

//Node.js exporting mode
module.exports = routes;