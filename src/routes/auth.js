const { Router } = require('express');

const Response = require('../lib/response');
const { validateRequest, authValidators } = require('../lib/validators');
const UserModel = require('../models/user');
const UserUspModel = require('../models/user-usp');
const jwt = require('../lib/jwt');

const router = Router();

// Login user
router.post(
  '/',
  validateRequest(authValidators.mockAuthUsp, async (req, res) => {
    const { nusp, password } = req.body;
    const userUsp = await UserUspModel.findOne({ nusp }).catch(() => {
      Response.failure('Error fetching UserUsp from db', 500).send(res);
      throw new Error();
    });

    if (!userUsp || userUsp.password !== password) {
      return Response.failure('Invalid credentials', 401).send(res);
    }

    let { _doc: user } = await UserModel.findOne({ nusp }).catch(() => {
      Response.failure('Error fetching user from db', 500).send(res);
      throw new Error();
    });

    if (!user) {
      user = await UserModel.create(user).catch(() => {
        Response.failure('Error creating user in db', 500).send(res);
        throw new Error();
      });
    }
    res.setHeader('authorization', jwt.create({ id: user._id }));

    Response.success(user).send(res);
  }),
);

module.exports = router;
