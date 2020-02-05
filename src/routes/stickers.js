const { Router } = require('express');

const UserModel = require('../models/user');
const Response = require('../lib/response');
const { withAuthorization } = require('../lib/jwt');

const router = Router();

const NUMBER_OF_STICKERS = 30;

router.post(
  '/trade',
  withAuthorization(async (req, res) => {
    const { id: userId } = req.auth;
    const { stickers } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.failure('Usuário não encontrado', 404).send(res);
    }

    let stickersCopy = stickers;
    console.log(stickersCopy);
    console.log(user.stickers);

    user.stickers.map((sticker) => {
      if (stickersCopy.indexOf(sticker) >= 0) {
        stickersCopy = stickersCopy.splice(stickersCopy.indexOf(sticker), 1);
      }
    });

    console.log(stickersCopy);

    return Response.success({ sticker_id: 1 }).send(res);
  }),
);

module.exports = router;
