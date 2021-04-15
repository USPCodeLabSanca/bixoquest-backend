const createError = require('http-errors');

const NUMBER_OF_STICKERS = 36;
const NUMBER_OF_SPECIAL_STICKERS = 9;

const packService = {
  openPack: async (user) => {
    if (user.availablePacks < 1) {
      throw new createError.BadRequest('Sem pacotes disponíveis');
    }

    const stickerId = Math.floor(Math.random() * NUMBER_OF_STICKERS);
    user.availablePacks -= 1;
    user.openedPacks += 1;
    user.stickers.push(stickerId);
    await user.save();

    return stickerId;
  },
  openSpecialPack: async (user) => {
    if (user.availableSpecialPacks < 1) {
      throw new createError.BadRequest('Sem pacotes especiais disponíveis');
    }

    const specialStickerId = Math.floor(Math.random() * NUMBER_OF_SPECIAL_STICKERS);
    user.availableSpecialPacks -= 1;
    user.openedSpecialPacks += 1;
    user.specialStickers.push(specialStickerId);
    await user.save();

    return specialStickerId;
  },
};

module.exports = packService;
