const userService = require('../services/user.service');

const userController = {
  getLoggedUser: async (req, res) => {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      return res.send(error);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const {id} = req.params;

      const user = await userService.getUserProfile(id);

      return res.status(200).json(user);
    } catch (error) {
      return res.send(error);
    }
  },
  addFriend: async (req, res) => {
    try {
      const {id} = req.user;
      const {idFriend} = req.body;

      const friend = await userService.addFriend(id, idFriend);

      return res.status(200).json(friend);
    } catch (error) {
      return res.send(error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await userService.getUsers();

      return res.status(200).json(users);
    } catch (error) {
      return res.send(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const {id} = req.params;

      const user = await userService.getUser(id);

      return res.status(200).json(user);
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
        character,
        discord,
      } = req.body;

      const newUser = await userService.createUser(nusp, name, isAdmin, course, character, discord);

      return res.status(200).json(newUser);
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
        character,
        discord,
      } = req.body;

      const editedUser = await userService.editUser(id, nusp, name, isAdmin, course, character, discord);

      return res.status(200).json(editedUser);
    } catch (error) {
      return res.send(error);
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const {_id, nusp, name, isAdmin, course} = req.user;
      const {
        character,
        discord,
      } = req.body;

      const editedUser = await userService.editUser(_id, nusp, name, isAdmin, course, character, discord);

      return res.status(200).json(editedUser);
    } catch (error) {
      return res.send(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const {id} = req.params;

      const deletedUser = await userService.deleteUser(id);

      return res.status(200).json(deletedUser);
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = userController;
