import bcrypt from 'bcrypt';
import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import { nanoid } from 'nanoid';
import { generateToken } from '../helpers/jwt.js';
import sendEmail from '../helpers/sendEmail.js';
import verifyEmailMarkup from '../helpers/verifyEmailMarkup.js';

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: 'Contacts App - Verify your email address',
  html: verifyEmailMarkup(verificationToken),
});

export const findUser = query =>
  User.findOne({
    where: query,
  });

export const registerUser = async data => {
  const { email, password } = data;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({ ...data, password: hashPassword, verificationToken });

  const verifyEmail = createVerifyEmail(email, verificationToken);

  await sendEmail(verifyEmail);

  return newUser;
};

export const loginUser = async data => {
  const { email, password } = data;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    email,
  };

  const token = generateToken(payload);

  await user.update({ token });

  return { token, user: { email: user.email, subscription: user.subscription, avatarURL: user.avatarURL } };
};

export const logoutUser = async id => {
  const user = await findUser({ id });
  if (!user || !user.token) {
    throw HttpError(404, 'User not found');
  }

  await user.update({ token: null });
};

export const updateUserAvatar = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update(data);
  return user;
};

export const verifyUser = async verificationToken => {
  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update({ verificationToken: null, verify: true });
};

export const resendVerification = async email => {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, 'Email not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
};
