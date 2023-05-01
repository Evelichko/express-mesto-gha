const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {

    name: {
      type: String,
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
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (avatar) => /.+@.+\..+/.test(avatar),
        message: 'Введите ссылку на аватар',
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Введите электронный адрес',
      },
    },
    password: {
      type: String,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
