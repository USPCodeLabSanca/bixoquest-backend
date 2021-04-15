const createError = require('http-errors');

const UserModel = require('../models/user');

const stickerService = {
  donate: async (donator, stickers, receiverId) => {
    if (stickers.some((sticker) => donator.stickers.indexOf(sticker) === -1)) {
      throw new createError.BadRequest('Você não possui essas figurinhas');
    }

    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      throw new createError.NotFound('Recebedor não encontrado');
    }
    const beforeTradeNumberOfCards = donator.stickers.length;

    for (const sticker of stickers) {
      if (donator.stickers.indexOf(sticker) >= 0) {
        donator.stickers.splice(donator.stickers.indexOf(sticker), 1);
        receiver.stickers.push(sticker);
      }
    }

    if (beforeTradeNumberOfCards - donator.stickers.length < stickers.length) {
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
