const { Router } = require('express');

const UsersController = require('../../controllers/users');

const router = Router();

router.get('/', UsersController.getUsers);

router.get('/:id', UsersController.getUser);

router.post('/', UsersController.createUser);

router.put('/:id', UsersController.editUser);

router.delete('/:id', UsersController.deleteUser);

module.exports = router;
