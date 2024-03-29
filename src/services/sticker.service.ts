import createError from 'http-errors';

import UserModel from '../models/user';

export default {
  donate: async (donator: any, stickers: any[], receiverId: string) => {
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
  donateSpecial: async (donator: any, specialStickers: any[], receiverId: string) => {
    if (specialStickers.some((specialSticker) => donator.specialStickers.indexOf(specialSticker) === -1)) {
      throw new createError.BadRequest('Você não possui essas figurinhas especiais');
    }

    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      throw new createError.NotFound('Recebedor não encontrado');
    }
    const beforeTradeNumberOfCards = donator.specialStickers.length;

    for (const specialSticker of specialStickers) {
      if (donator.specialStickers.indexOf(specialSticker) >= 0) {
        donator.specialStickers.splice(donator.specialStickers.indexOf(specialSticker), 1);
        receiver.specialStickers.push(specialSticker);
      }
    }

    if (beforeTradeNumberOfCards - donator.specialStickers.length < specialStickers.length) {
      throw new createError.BadRequest('O doador não possui essas figurinhas');
    }

    await Promise.all([
      donator.save(),
      receiver.save(),
    ]);

    return donator.name;
  },
};
