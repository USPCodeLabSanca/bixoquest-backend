const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');

const Response = require('../lib/response');
const {sendEmail} = require('../lib/send-email');

/**
 * handleValidationError
 *
 * @param {object} req
 *
 * @return {object}
 */
function handleValidationError(req) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return createError.BadRequest({errors: validationErrors.array()});
  }
}

/**
 * formatUserResponse
 *
 * @param {object} user
 *
 * @return {object}
 */
function formatUserResponse(user) {
  return {
    success: true,
    message: 'Usuário autenticado com sucesso.',
    user: {
      email: user.email,
      nusp: user.nusp,
      name: user.name,
      id: user._id,
      course: user.course,
    },
  };
}

module.exports.loginAdmin = async (req, res, next) => {
  try {
    const {key} = req.body;

    if (key !== process.env.ADMIN_KEY) {
      return next(createError.Forbidden('Senha incorreta.'));
    }

    const currentUser = await UserModel.findOne({nusp: key});

    const token = jwt.create({id: currentUser._id, isAdmin: true});
    res.setHeader('authorization', token);

    return Response.success({
      success: true,
      message: 'Administrador autenticado com sucesso.',
      user: currentUser,
      token,
    }).send(res);
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const validationError = handleValidationError(req, next);
    if (validationError) {
      return next(validationError);
    }

    const {
      email,
      name,
      password,
      course,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null, isAdmin: false});
    if (foundUser) {
      return next(createError.Unauthorized());
    }

    const createdUser = new UserModel({
      email,
      nusp: null,
      name,
      password,
      course,
    });
    await createdUser.save();

    await sendEmail(
        createdUser.email,
        'Bem vindo ao BixoQuest 2021!',
        `Você se cadastrou no nosso app e já está tudo certo!!!`,
        `<div><h1>Voc&ecirc;&nbsp;se&nbsp;cadastrou&nbsp;no&nbsp;nosso&nbsp;app&nbsp;e&nbsp;j&aacute;&nbsp;est&aacute;&nbsp;tudo&nbsp;certo!!!</h1></div>`,
    );

    const token = jwt.sign({data: {id: createdUser._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json(formatUserResponse(createdUser));
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.signupUspSecondStep = async (req, res) => {
  try {
    const validationError = handleValidationError(req, next);
    if (validationError) {
      return next(validationError);
    }

    const {
      course,
      permission,
    } = req.body;

    const foundUser = await UserModel.findOne({email: req.user.email, nusp: req.user.nusp});
    if (!foundUser) {
      return next(createError.Unauthorized());
    }

    foundUser.course = course;
    foundUser.permission = permission;
    await foundUser.save();

    await sendEmail(
        foundUser.email,
        'Bem vindo ao BixoQuest 2021!',
        `Você se cadastrou no nosso app e já está tudo certo!!!`,
        `<div><h1>Voc&ecirc;&nbsp;se&nbsp;cadastrou&nbsp;no&nbsp;nosso&nbsp;app&nbsp;e&nbsp;j&aacute;&nbsp;est&aacute;&nbsp;tudo&nbsp;certo!!!</h1></div>`,
    );

    const token = jwt.sign({data: {id: foundUser._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json(formatUserResponse(foundUser, houseWithLessMembers));
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.login = async (req, res, next) => {
  const validationError = handleValidationError(req, next);
  if (validationError) {
    return next(validationError);
  }

  try {
    const {
      email,
      password,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (!foundUser || !foundUser.password || !bcrypt.compareSync(password, foundUser.password)) {
      return next(createError.Unauthorized());
    }

    const token = jwt.sign({data: {id: foundUser._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json(formatUserResponse(foundUser));
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  const validationError = handleValidationError(req, next);
  if (validationError) {
    return next(validationError);
  }

  try {
    const {
      email,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (!foundUser || !foundUser.password) {
      return next(createError.Unauthorized());
    }

    const code = crypto.randomBytes(6).toString('hex');

    foundUser.resetPasswordCode = code;
    await foundUser.save();

    await sendEmail(
        foundUser.email,
        'Recuperação de Senha',
        `Seu código para recuperação de senha: ${foundUser.resetPasswordCode}`,
        `<div><h1>Seu&nbsp;c&oacute;digo&nbsp;para&nbsp;recupera&ccedil;&atilde;o&nbsp;de&nbsp;senha:&nbsp;${foundUser.resetPasswordCode}</h1></div>`,
    );

    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.resetPassword = async (req, res, next) => {
  const validationError = handleValidationError(req, next);
  if (validationError) {
    return next(validationError);
  }

  try {
    const {
      email,
      code,
      password,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (!foundUser || !foundUser.password || code !== foundUser.resetPasswordCode) {
      return next(createError.Unauthorized());
    }

    foundUser.password = password;
    await foundUser.save();

    const token = jwt.sign({data: {id: foundUser._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json(formatUserResponse(foundUser));
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.getLoggedUser = async (req, res, next) => {
  try {
    return res.status(200).json(formatUserResponse(req.user));
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.authenticate = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (token) {
      token = token.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY).data;

      req.user = await UserModel.findById(decoded.id);
    }

    next();
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createError.Unauthorized());
    }

    next();
  } catch (error) {
    console.log(error);
    return next(createError.InternalServerError('Erro no servidor.'));
  }
};

module.exports.authenticateUser = async (data, cb) => {
  const user = JSON.parse(data);
  const currentUser = await UserModel.findOne({
    email: user.emailUspUsuario,
    nusp: user.loginUsuario,
  });

  if (!currentUser) {
    const newUser = new UserModel({
      nusp: user.loginUsuario,
      email: user.emailUspUsuario,
      name: user.nomeUsuario,
      isAdmin: false,
      course: user.vinculo && user.vinculo[0] && user.vinculo[0].siglaUnidade,
      completed_missions: [],
      available_packs: 0,
      opened_packs: 0,
      stickers: [],
      lastTrade: null,
    });
    await newUser.save();

    delete newUser.isAdmin;
    delete newUser.lastTrade;

    if (newUser) {
      return cb(null, newUser);
    }
  }

  delete newUser.isAdmin;
  delete newUser.lastTrade;

  return cb(null, currentUser);
};

module.exports.authenticationSuccess = async (req, res, next) => {
  if (!req.cookies.session) {
    return next(createError.Forbidden('Cookie não pode ser vazio.'));
  }

  if (!req.user) {
    return next(createError.Forbidden('Usuário não encontrado.'));
  }

  const token = jwt.sign({data: {id: req.user._id}}, process.env.JWT_PRIVATE_KEY, {
    expiresIn: '30d',
  });

  if (req.user && req.user.nusp) {
    return res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      isSignup: false,
      ...formatUserResponse(req.user),
    });
  }
  return res.status(200).json({
    isSignup: true,
    success: true,
    token: `Bearer ${token}`,
  });
};

module.exports.authenticationFailure = async (req, res, next) => next(createError.Forbidden({
  success: false,
  message: 'Falha ao autenticar usuário.',
}));

module.exports.logout = async (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
};
