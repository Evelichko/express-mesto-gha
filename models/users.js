const mongoose = require('mongoose');

// const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },

    about: {
      type: String,
      required: true,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },

    avatar: {
      type: String,
      required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Требуется ввести электронный адрес',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 6,
        message: 'Пароль должен состоять минимум из 6 символов',
      },
    },
  },
  {
    versionKey: false,
    // statics: {
    //   findUserByCredentials(email, password) {
    //     return this
    //       .findOne({ email })
    //       .select('+password')
    //       .then((user) => {
    //         if (user) {
    //           return bcrypt.compare(password, user.password)
    //             .then((matched) => {
    //               if (matched) return user;

    //               return Promise.reject();
    //             });
    //         }
    //         return Promise.reject();
    //       });
    //   },
    // },
  },
);

module.exports = mongoose.model('user', userSchema);
