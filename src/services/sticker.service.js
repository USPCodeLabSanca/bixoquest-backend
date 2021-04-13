const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');

const stickerService = {
  donate: async (user, stickers) => {
    if (stickers.some((sticker) => user.stickers.indexOf(sticker) === -1)) {
      throw new createError.BadRequest('Você não possui essas figurinhas');
    }

    const token = jwt.sign({data: {isMission: false, userId: user._id, donatorName: user.name, stickers}}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    user.lastTrade = token;
    await user.save();

    return token;
  },
  receive: async (receiver, token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY).data;

    const donator = await UserModel.findById(decodedToken.userId);
    if (!donator) {
      throw new createError.NotFound('Doador não encontrado');
    }
    if (donator.lastTrade !== token) {
      throw new createError.NotFound('Troca não existente');
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
      throw new createError.BadRequest('O doador não possui essas figurinhas');
    }

    await Promise.all([
      donator.save(),
      receiver.save(),
    ]);

    return donator.name;
  },
};

module.exports = stickerService;
