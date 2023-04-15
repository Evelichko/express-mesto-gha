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


// app.use((req, res, next) => {
//   req.user = {
//     _id: '5d8b8592978f8bd833ca8133'
//   };

//   next();
// });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routeUsers);
app.use('/', routeCards);

app.use((req, res, next) => next(console.log('ошибка')));

app.listen(PORT, () => {console.log('я подключился')});
