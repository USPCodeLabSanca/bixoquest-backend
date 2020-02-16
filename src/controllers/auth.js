const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../models/user');
const jwt = require('../lib/jwt');
const Response = require('../lib/response');

module.exports.authenticateUser = async (data, cb) => {
  const user = JSON.parse(data).loginUsuario;
  const currentUser = await UserModel.findOne({ nusp: user.loginUsuario });

  if (!currentUser) {
    const newUser = new UserModel();

    newUser._id = new ObjectId();
    newUser.nusp = user.loginUsuario;
    newUser.name = user.nomeUsuario;
    newUser.isAdmin = false;
    newUser.course = user.siglaUnidade;
    newUser.completed_missions = [];
    newUser.available_packs = 0;
    newUser.opened_packs = 0;
    newUser.stickers = [];
    newUser.lastTrade = null;

    await newUser.save();

    delete newUser.isAdmin;
    delete newUser.lastTrade;

    if (newUser) {
      cb(null, newUser);
    }
  }

  delete currentUser.isAdmin;
  delete currentUser.lastTrade;

  cb(null, currentUser);
};

module.exports.authenticationSuccess = async (req, res) => {
  if (!req.cookies.session) {
    return Response.failure('Cookie não pode ser vazio.', 403).send(res);
  }

  if (!req.user) {
    return Response.failure('Usuário não encontrado', 403).send(res);
  }

  const authorization = jwt.create({ id: req.user._id });

  return Response.success({
    success: true,
    message: 'Usuário autenticado com sucesso.',
    user: req.user,
    token: authorization,
  }).send(res);
};

module.exports.authenticationFailure = async (req, res) => {
  return Response.failure({
    success: false,
    message: 'Falha ao autenticar usuário.',
  }, 403).send(res);
};

module.exports.logout = async (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
};
