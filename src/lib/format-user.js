module.exports.formatUser = function(user, fields) {
  const formatedUser = {
    nusp: user.nusp,
    email: user.email,
    password: user.password,
    name: user.name,
    character: {
      skin: user.character.skin,
      cheek: user.character.cheek,
      clothBottom: user.character.clothBottom,
      clothTop: user.character.clothTop,
      eyes: user.character.eyes,
      feet: user.character.feet,
      hair: user.character.hair,
      mouth: user.character.mouth,
    },
    course: user.course,
    friends: user.friends,
    discord: user.discord,
    completedMissions: user.completedMissions,
    availablePacks: user.availablePacks,
    openedPacks: user.openedPacks,
    stickers: user.stickers,
    lastTrade: user.lastTrade,
    resetPasswordCode: user.resetPasswordCode,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  for (field of Object.keys(formatedUser)) {
    if (fields.indexOf(field) === -1) delete formatedUser[field];
  }

  return formatedUser;
};
