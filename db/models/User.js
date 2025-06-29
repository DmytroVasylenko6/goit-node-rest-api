import { DataTypes } from 'sequelize';
import { sequelize } from '../Sequelize.js';
import { emailRegexp } from '../../constants/regexp.js';
import gravatar from 'gravatar';

const User = sequelize.define(
  'user',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: emailRegexp,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription: {
      type: DataTypes.ENUM,
      values: ['starter', 'pro', 'business'],
      defaultValue: 'starter',
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    avatarURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    hooks: {
      beforeCreate: (user) => {
        if (!user.avatarURL) {
          user.avatarURL = gravatar.url(user.email, { s: '250' }, true);
        }
      },
    },
  }
);

// User.sync({ force: true });

export default User;
