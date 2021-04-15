const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');

const {sendEmail} = require('../lib/send-email');
const {formatUser} = require('../lib/format-user');
const {handleValidationResult} = require('../lib/handle-validation-result');

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
    user: formatUser(user, [
      '_id',
      'email',
      'nusp',
      'name',
      'discord',
      'course',
      'character',
      'completedMissions',
      'availablePacks',
      'stickers',
      'friends',
    ]),
  };
}

/**
 * Signup
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function signup(req, res, next) {
  try {
    handleValidationResult(req);

    const {
      email,
      name,
      discord,
      character,
      password,
      course,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (foundUser) {
      throw new createError.Unauthorized();
    }

    const createdUser = new UserModel({
      email,
      nusp: null,
      name,
      discord,
      character,
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

    if (!createError.isHttpError(error)) {
      error = new createError.InternalServerError('Erro no servidor.');
    }

    return next(error);
  }
}

/**
 * Signup Usp Second Step
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function signupUspSecondStep(req, res, next) {
  try {
    handleValidationResult(req);

    const user = req.user;
    const {
      course,
      discord,
      character,
    } = req.body;

    user.course = course;
    user.discord = discord;
    user.character = character;
    await user.save();

    await sendEmail(
        user.email,
        'Bem vindo ao BixoQuest 2021!',
        `Você se cadastrou no nosso app e já está tudo certo!!!`,
        `<div><h1>Voc&ecirc;&nbsp;se&nbsp;cadastrou&nbsp;no&nbsp;nosso&nbsp;app&nbsp;e&nbsp;j&aacute;&nbsp;est&aacute;&nbsp;tudo&nbsp;certo!!!</h1></div>`,
    );

    const token = jwt.sign({data: {id: user._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json(formatUserResponse(user));
  } catch (error) {
    console.log(error);

    if (!createError.isHttpError(error)) {
      error = new createError.InternalServerError('Erro no servidor.');
    }

    return next(error);
  }
}

/**
 * Login
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function login(req, res, next) {
  try {
    handleValidationResult(req);

    const {
      email,
      password,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (!foundUser || !foundUser.password || !bcrypt.compareSync(password, foundUser.password)) {
      throw new createError.Unauthorized();
    }

    const token = jwt.sign({data: {id: foundUser._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json(formatUserResponse(foundUser));
  } catch (error) {
    console.log(error);

    if (!createError.isHttpError(error)) {
      error = new createError.InternalServerError('Erro no servidor.');
    }

    return next(error);
  }
}

/**
 * Forgot Password
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function forgotPassword(req, res, next) {
  try {
    handleValidationResult(req);

    const {
      email,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (!foundUser || !foundUser.password) {
      throw new createError.Unauthorized();
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

    if (!createError.isHttpError(error)) {
      error = new createError.InternalServerError('Erro no servidor.');
    }

    return next(error);
  }
}

/**
 * Reset Password
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function resetPassword(req, res, next) {
  try {
    handleValidationResult(req);

    const {
      email,
      code,
      password,
    } = req.body;

    const foundUser = await UserModel.findOne({email, nusp: null});
    if (!foundUser || !foundUser.password || code !== foundUser.resetPasswordCode) {
      throw new createError.Unauthorized();
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

    if (!createError.isHttpError(error)) {
      error = new createError.InternalServerError('Erro no servidor.');
    }

    return next(error);
  }
}

/**
 * Authenticate User
 *
 * @param {object} data
 * @param {function} cb
 */
async function authenticateUser(data, cb) {
  const user = JSON.parse(data);
  const currentUser = await UserModel.findOne({
    nusp: user.loginUsuario,
  });

  if (!currentUser) {
    const newUser = new UserModel({
      nusp: user.loginUsuario,
      email: user.emailUspUsuario,
      name: user.nomeUsuario,
      course: null,
    });

    await newUser.save();

    if (newUser) {
      return cb(null, newUser);
    }
  }

  return cb(null, currentUser);
}

/**
 * Authentication Success
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function authenticationSuccess(req, res, next) {
  try {
    if (!req.cookies.session) {
      throw new createError.Forbidden('Cookie não pode ser vazio.');
    }

    if (!req.user) {
      throw new createError.Forbidden('Usuário não encontrado.');
    }

    const token = jwt.sign({data: {id: req.user._id}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    if (req.user && req.user.nusp && req.user.course) {
      return res.status(200).json({
        success: true,
        isSignup: false,
        ...formatUserResponse(req.user),
      });
    }
    return res.status(200).json({
      isSignup: true,
      success: true,
    });
  } catch (error) {
    console.log(error);

    if (!createError.isHttpError(error)) {
      error = new createError.InternalServerError('Erro no servidor.');
    }

    return next(error);
  }
}

/**
 * Authentication Failure
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function authenticationFailure(req, res, next) {
  return next(
      createError.Forbidden({
        success: false,
        message: 'Falha ao autenticar usuário.',
      }),
  );
}

/**
 * Logout USP User
 *
 * @param {object} req
 * @param {object} res
 */
async function logout(req, res) {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
}

module.exports = {
  signup,
  signupUspSecondStep,
  login,
  forgotPassword,
  resetPassword,
  authenticateUser,
  authenticationSuccess,
  authenticationFailure,
  logout,
};
