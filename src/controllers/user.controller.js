const userService = require('../services/user.service');
const Response = require('../lib/response');

const userController = {
  getLoggedUser: async (req, res) => {
    try {
      const {id} = req.auth;

      const user = await userService.getUserBasicData(id);

      return Response.success(user).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await userService.getUsers();

      return Response.success(users).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const {id} = req.params;

      const user = await userService.getUser(id);

      return Response.success(user).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  createUser: async (req, res) => {
    try {
      const {
        nusp,
        name,
        isAdmin,
        course,
      } = req.body;

      const newUser = await userService.createUser(nusp, name, isAdmin, course);

      return Response.success(newUser).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  editUser: async (req, res) => {
    try {
      const {id} = req.params;
      const {
        nusp,
        name,
        isAdmin,
        course,
      } = req.body;

      const editedUser = await userService.editUser(id, nusp, name, isAdmin, course);

      return Response.success(editedUser).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const {id} = req.params;

      const deletedUser = await userService.deleteUser(id);

      return Response.success(deletedUser).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = userController;
