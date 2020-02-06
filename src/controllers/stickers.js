const Response = require('../lib/response');
const UserModel = require('../models/user');
const jwt = require('../lib/jwt');

module.exports.donate = async (req, res) => {
  const { id: userId } = req.auth;
  const { stickers } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return Response.failure('Usuário não encontrado', 404).send(res);
  }

  if (user.lastTrade) {
    jwt.decode(user.lastTrade).stickers.forEach((sticker) => {
      user.stickers.push(sticker);
    });
  }

  const stickersCopy = [...user.stickers];

  stickers.forEach((sticker) => {
    if (stickersCopy.indexOf(sticker) >= 0) {
      stickersCopy.splice(stickersCopy.indexOf(sticker), 1);
    }
  });

  if (user.stickers.length - stickersCopy.length < stickers.length) {
    return Response.failure('Você não possui essas figurinhas', 400).send(res);
  }

  const token = jwt.create({ isMission: false, userId: user._id, stickers });

  user.lastTrade = token;
  user.save();

  return Response.success(token).send(res);
};

module.exports.receive = async (req, res) => {
  const { id: userId } = req.auth;
  const { token } = req.body;

  const decodedToken = jwt.decode(token);

  const receiver = await UserModel.findById(userId);
  if (!receiver) {
    return Response.failure('Receptor não encontrado', 404).send(res);
  }

  const donator = await UserModel.findById(decodedToken.userId);
  if (!donator) {
    return Response.failure('Doador não encontrado', 404).send(res);
  }
  const beforeTradeNumberOfCards = donator.stickers.length;

  donator.lastTrade = null;

  decodedToken.stickers.forEach((sticker) => {
    if (donator.stickers.indexOf(sticker) >= 0) {
      donator.stickers.splice(donator.stickers.indexOf(sticker), 1);
      receiver.stickers.push(sticker);
    }
  });

  if (beforeTradeNumberOfCards - donator.stickers.length < decodedToken.stickers.length) {
    return Response.failure('O doador não possui essas figurinhas', 400).send(res);
  }

  donator.save();
  receiver.save();

  return Response.success(receiver).send(res);
};
