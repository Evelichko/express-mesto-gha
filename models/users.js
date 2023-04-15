const mongoose = require('mongoose');

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
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },

    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },

  {
    versionKey: false,
  },
);
console.log('create schema');

const User = mongoose.model('user', userSchema);

module.exports = { User };
