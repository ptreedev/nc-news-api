const { getUsers } = require("../controllers/controllers");

const usersRouter = require("express").Router();

usersRouter.get('/', getUsers)

module.exports = usersRouter
