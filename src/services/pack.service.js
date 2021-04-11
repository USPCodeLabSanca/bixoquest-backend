const createError = require('http-errors');

const NUMBER_OF_STICKERS = 36;

const packService = {
  openPack: async (user) => {
    if (user.availablePacks < 1) {
      throw new createError.BadRequest('Sem pacotes disponíveis');
    }

    const stickerId = Math.floor(Math.random() * NUMBER_OF_STICKERS);
    user.availablePacks -= 1;
    user.openedPacks += 1;
    user.stickers.push(stickerId);
    user.save();

    return stickerId;
  },
};

module.exports = packService;
