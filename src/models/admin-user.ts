import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
      },
      // 0 - Root Access
      // 1 - Full Access
      adminRole: {
        type: Number,
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
    {collection: 'admin-user'},
);

UserSchema.pre(['save', 'updateOne'], function(next) {
  const user = this;

  if (user.password && this.isModified('password')) {
    try {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    } catch (err: any) {
      return next(err);
    }
  }
  next();
});

export default Mongoose.model('admin-user', UserSchema);
