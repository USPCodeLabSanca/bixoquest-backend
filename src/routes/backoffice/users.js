const { Router } = require('express');

const UsersController = require('../../controllers/users');
const { withAuthorization } = require('../../lib/jwt');

const router = Router();

router.get('/', withAuthorization(UsersController.getUsers, true));

router.get('/:id', withAuthorization(UsersController.getUser, true));

router.post('/', withAuthorization(UsersController.createUser, true));

router.put('/:id', withAuthorization(UsersController.editUser, true));

router.delete('/:id', withAuthorization(UsersController.deleteUser, true));

module.exports = router;
