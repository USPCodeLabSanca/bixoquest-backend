const UserModel = require('../models/user');
const jwt = require('../lib/jwt');

const stickerService = {
  donate: async (userId, stickers) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new createError.NotFound('Usuário não encontrado');
    }

    if (stickers.some((sticker) => user.stickers.indexOf(sticker) === -1)) {
      throw new createError.BadRequest('Você não possui essas figurinhas');
    }

    const token = jwt.create({ isMission: false, userId: user._id, stickers });

    user.lastTrade = token;
    await user.save();

    return token;
  },
  receive: async (userId, token) => {
    const decodedToken = jwt.decode(token);

    const receiver = await UserModel.findById(userId);
    if (!receiver) {
      throw new createError.NotFound('Receptor não encontrado');
    }

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
