var express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer();
var cors = require('cors');
var mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
var app = express();
const router = require('express').Router();
var bcrypt = require('bcrypt');
var saltRound = 10;
const keys = require('./config/keys');
const authRoutes = require('./routes/auth-router');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cors());

mongoose.connect('mongodb://localhost/admin-dashboard', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully Connected.'))
  .catch(err => console.log(err));

var loginSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String
});
var Login = mongoose.model("Login", loginSchema, "login");


app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});




app.post('/find', (req, res) => {
  var { userEmail } = req.body;
  Login.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res.send('user not defined');
        console.log('user not defined');
      }
      else {
        return res.send(user.fullName)
      }
    })
});




app.post('/login', (req, res) => {

  var email = req.body.email;
  var password = req.body.password;
  // console.log(email, password);
  Login.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        res.send('user not defined');
      }
      else {
        // res.send(user.fullName);
        console.log(user.fullName);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          console.log('password is compared and matched');
          return res.send('Login successfully done.');
        } else {
          res.send('Incorrect password');
          res.redirect('/login');
        }
      });
    })
});

app.post('/signup', (req, res) => {
  // console.log(req.body);
  var loginInfo = req.body;
  if (!loginInfo.name || !loginInfo.email || !loginInfo.password || !loginInfo.confirmPassword) {
    console.log('error: please fill all form fields');
    res.send('All form fields are required');
  }
  else {
    bcrypt.hash(loginInfo.password, saltRound, function (err, hash) {
      var newUser = new Login({
        fullName: loginInfo.name,
        email: loginInfo.email,
        password: hash
      });
      newUser.save((err, loginInfo) => {
        if (err) {
          console.log(err);
          res.status('show message:', { message: 'db error' });
        }
        else {
          console.log('new user added into db');
          res.status('show_message', {
            message: "New person added", type: "success", person: loginInfo
          });
        }
      });
    })
  }

});

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log(err));
// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.render('home')
})


app.listen(4000, console.log('server started'));