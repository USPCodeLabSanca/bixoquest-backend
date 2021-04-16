const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = Mongoose.Schema(
    {
      nusp: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      character: {
        type: {
          skin: {type: Number},
          cheek: {type: Number},
          clothBottom: {type: Number},
          clothTop: {type: Number},
          eyes: {type: Number},
          feet: {type: Number},
          hair: {type: Number},
          mouth: {type: Number},
        },
        default: {
          skin: 0,
          cheek: 0,
          clothBottom: 0,
          clothTop: 0,
          eyes: 0,
          feet: 0,
          hair: 0,
          mouth: 0,
        },
        required: true,
      },
      course: {
        type: String,
        default: 'Não informado',
      },
      friends: {
        type: [{type: Mongoose.Schema.Types.ObjectId, ref: 'user'}],
        default: [],
      },
      discord: {
        type: String,
        default: 'Não informado',
      },
      completedMissions: {
        type: Array,
        default: [],
      },
      availablePacks: {
        type: Number,
        default: 0,
      },
      openedPacks: {
        type: Number,
        default: 0,
      },
      stickers: {
        type: Array,
        default: [],
      },
      availableSpecialPacks: {
        type: Number,
        default: 0,
      },
      openedSpecialPacks: {
        type: Number,
        default: 0,
      },
      specialStickers: {
        type: Array,
        default: [],
      },
      resetPasswordCode: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now(),
      },
    },
    {collection: 'user'},
);

UserSchema.index({nusp: 1, email: 1}, {unique: true});

UserSchema.pre(['save', 'updateOne', 'findOneAndUpdate'], function(next) {
  const user = this;

  if (user.password && this.isModified('password')) {
    try {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = Mongoose.model('user', UserSchema);
