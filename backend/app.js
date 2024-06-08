var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Card = require('./models/Card');
const config = require("./config");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const url = config.mongoURI.prod;
mongoose.connect(config.mongoURI.prod, {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


app.post('/cards', async (req, res) => {
  try {
    const cards = req.body.items.map(card => ({
      ...card,
      counter_list: card.counter_list || [],
      synergy_list: card.synergy_list || []
    }));
    await Card.insertMany(cards);
    res.status(201).send('Cards added successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

var port = 3000;

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
