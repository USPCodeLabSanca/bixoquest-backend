const UserModel = require('../models/user');
const createError = require('http-errors')

const NUMBER_OF_STICKERS = 36;

const packService = {
  openPack: async (userId) => {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new createError.NotFound('Usuário não encontrado');
    }

    if (user.available_packs < 1) {
      throw new createError.BadRequest('Sem pacotes disponíveis');
    }

    const stickerId = Math.floor(Math.random() * NUMBER_OF_STICKERS);
    user.available_packs -= 1;
    user.opened_packs += 1;
    user.stickers.push(stickerId);
    user.save();

    return stickerId;
  },
};

module.exports = packService;
