const { Router } = require("express");
const TagsController = require("../controllers/TagsController");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

const tagsRoutes = Router();

const tagsController = new TagsController()

tagsRoutes.get("/", ensureAuthentication, tagsController.index);



//Exporting usersRoutes for all files
module.exports = tagsRoutes