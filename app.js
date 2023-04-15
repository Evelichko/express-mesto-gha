const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');

const routeCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '643aacdc1a4bc372d5b763b9',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => next(console.log('ошибка')));

app.listen(PORT, () => { console.log('я подключился'); });
