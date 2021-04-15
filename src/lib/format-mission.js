module.exports.formatMission = function(mission, fields) {
  const formatedMission = {
    _id: mission._id,
    title: mission.title,
    description: mission.description,
    locationReference: mission.locationReference,
    numberOfPacks: mission.numberOfPacks,
    lat: mission.lat,
    lng: mission.lng,
    availableAt: mission.availableAt,
    expirateAt: mission.expirateAt,
    key: mission.key,
    type: mission.type,
    isSpecial: mission.isSpecial,
  };

  for (const field of Object.keys(formatedMission)) {
    if (fields.indexOf(field) === -1) delete formatedMission[field];
  }

  return formatedMission;
};
