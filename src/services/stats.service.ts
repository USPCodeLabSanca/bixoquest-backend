import UserModel from '../models/user';

/**
 * Check if array includes items
 */
function arrayIncludesItems(array: any[], items: any): boolean {
  for (const item of items) {
    if (!array.includes(item)) {
      return false;
    }
  }
  return true;
}

export default {
  getStats: async () => {
    const users = await UserModel.find({}, null, {rawResult: true});
    const stats = {
      users: 0,
      completedMissions: 0,
      packs: 0,
      openedPacks: 0,
      specialPacks: 0,
      openedSpecialPacks: 0,
      page1: 0,
      page2: 0,
      page3: 0,
      page4: 0,
      specialPage1: 0,
    };

    for (const user of users) {
      stats.users++;
      stats.completedMissions += user.completedMissions.length;
      stats.packs += (user.availablePacks + user.openedPacks);
      stats.openedPacks += user.openedPacks;
      stats.specialPacks += (user.availableSpecialPacks + user.openedSpecialPacks);
      stats.openedSpecialPacks += user.openedSpecialPacks;
      if (arrayIncludesItems(user.stickers, [0, 1, 2, 3, 4, 5, 6, 7, 8])) {
        stats.page1++;
      }
      if (arrayIncludesItems(user.stickers, [9, 10, 11, 12, 13, 14, 15, 16, 17])) {
        stats.page2++;
      }
      if (arrayIncludesItems(user.stickers, [18, 19, 20, 21, 22, 23, 24, 25, 26])) {
        stats.page3++;
      }
      if (arrayIncludesItems(user.stickers, [27, 28, 29, 30, 31, 32, 33, 34, 35])) {
        stats.page4++;
      }
      if (arrayIncludesItems(user.specialStickers, [0, 1, 2, 3, 4, 5, 6, 7, 8])) {
        stats.specialPage1++;
      }
    }

    return stats;
  },
};
