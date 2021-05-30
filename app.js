const express = require('express');
const http =  require('http');
const mongoose = require('mongoose');

const log = require('debug')('app:startup'); 
const dblog = require('debug')('app:db'); 
//const logger = require('morgan');
/*
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
*/
const indexRouter = require('./routes/index');
const studentRouter = require('./routes/student');
const paperSetterRouter = require('./routes/paperSetter');
const paperRouter = require('./routes/paper');
const examRouter = require('./routes/exam');


const app = express();
app.use(express.json()); 
log("App started... : 1st log")

const port = process.env.PORT || 3000;



/*
const corsOptions = {
  origin:'http://localhost:3001', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
*/
// view engine setup
/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
*/


const server = http.createServer(app);

server.listen(port);

// connect to database
mongoose.connect('mongodb://localhost/ExamPortal', {useNewUrlParser: true, useUnifiedTopology: true}) // connection string should come from a configuration file
    .then(()=>dblog('Connected to database...'))
    .catch(err => dblog('Error to connect database...' ,err));

app.use('/api', indexRouter);
app.use('/api/paper', paperRouter);
app.use('/api/student', studentRouter);
app.use('/api/papersetter', paperSetterRouter);
app.use('/api/exam', examRouter);


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
