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
      isAdmin: {
        type: Boolean,
        default: false,
      },
      // 0 - Root Access
      // 1 - Full Access
      adminRole: {
        type: Number,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      course: {
        type: String,
        default: 'Não informado',
      },
      completed_missions: {
        type: Array,
      },
      available_packs: {
        type: Number,
      },
      opened_packs: {
        type: Number,
      },
      stickers: {
        type: Array,
      },
      lastTrade: {
        type: String,
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

UserSchema.index({nusp: 1, email: 1, isAdmin: 1}, {unique: true});

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
