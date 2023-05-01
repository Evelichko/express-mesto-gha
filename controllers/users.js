const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function getCurrentUserInfo(req, res, next) {
  const id = req.user._id;
  User
    .findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch(next);
}

function getAllUsers(req, res, next) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

function getUserInfo(req, res, next) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

function setUserInfo(req, res, next) {
  const { name, about } = req.body;
  // const { _id: userId } = req.user;
  const _id = req.user;

  User
    .findByIdAndUpdate(
      _id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send(user);

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
}

function setUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ data: user });

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неверные данные для входа');
    }

    const hasRightPassword = await bcrypt.compare(password, user.password);

    if (!hasRightPassword) {
      throw new UnauthorizedError('Неверные данные для входа');
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      {
        expiresIn: '7d',
      },
    );

    res.send({ jwt: token });
  } catch (err) {
    next(err);
  }
}

// function getCurrentUserInfo(req, res, next) {
//   const _id = req.user;
//   User
//     .findById(_id)
//     .then((user) => {
//       if (user) return res.status(200).send(user);
//       throw new NotFoundError('Пользователь с таким id не найден');
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new InaccurateDataError('Передан некорректный id'));
//       } else {
//         next(err);
//       }
//     });
// }

module.exports = {
  createUser,
  getAllUsers,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  login,
  getCurrentUserInfo,
};