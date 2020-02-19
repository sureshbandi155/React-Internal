var express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer();
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
var bcrypt = require('bcrypt');
var saltRound = 10;

// google login
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20');
// const cookieSession = require('cookie-session');

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

app.post('/login', (req, res) => {

  var email= req.body.email;
  var password = req.body.password;
  // console.log(email, password);
  Login.findOne({email: email})
      .then((user) => {
        // console.log(user);
          if (!user) {
              res.send('user not defined');
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

// // passport google login
// // cookieSession config
// app.use(cookieSession({
//   maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
//   keys: ['randomstringhere']
// }));

// app.use(passport.initialize()); // Used to initialize passport
// app.use(passport.session()); // Used to persist login sessions

// // Strategy config
// passport.use(new GoogleStrategy({
//       clientID: '1002797710780-o39g3un6tukk7uk1v0p6omsjssu1u0u7.apps.googleusercontent.com',
//       clientSecret: 'tlg37ZFy_wjuiQJ7i4NWe7bP',
//       callbackURL: 'http://localhost:4000/auth/google/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//       done(null, profile); // passes the profile data to serializeUser
//   }
// ));

// // Used to stuff a piece of information into a cookie
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// // Used to decode the received cookie and persist session
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // Middleware to check if the user is authenticated
// function isUserAuthenticated(req, res, next) {
//   if (req.user) {
//       next();
//   } else {
//       res.send('You must login!');
//   }
// }

// // Routes
// // app.get('/', (req, res) => {
// //   res.render('index.ejs');
// // });

// // passport.authenticate middleware is used here to authenticate the request
// app.get('/auth/google', passport.authenticate('google', {
//   scope: ['profile'] // Used to specify the required data
// }));

// // The middleware receives the data from Google and runs the function on Strategy config
// app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
//   res.redirect('/secret');
// });

// // Secret route
// app.get('/secret', isUserAuthenticated, (req, res) => {
//   res.send('You have reached the secret route');
// });

// // Logout route
// app.get('/logout', (req, res) => {
//   req.logout(); 
//   res.redirect('/login');
// });
app.listen(4000, console.log('server started'));