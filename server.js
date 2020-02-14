var express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer();
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
var bcrypt = require('bcrypt');
var saltRound = 10;

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

app.get('', function (req, res) {
  res.send("Hello world!");
});
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.post('/login', (req, res) => {
  var email= req.body.email;
  var password = req.body.password;
  Login.findOne({email: email})
      .then((user) => {
          if (!user) {
              //res.redirect('/login');
              console.log('user not defined');
              res.send('user not defined');
          }
          bcrypt.compare(password, user.password, (err, result) => {
              if (result === true) {
                  console.log('password is compared and matched');
                   var specificUser = user;
                  // console.log('login userName:' + specificUser.name);
                  return res.send('login userName:' + specificUser.fullName);
                   res.redirect('/dashboard');
                  //window.location.href = 'http://localhost:3000/faq-page';
              } else {
                  // console.log('Incorrect password');
                  res.send('Incorrect password');
                  res.redirect('/login')
              }
          });
      })
});

app.post('/signup', (req, res) => {
  console.log(req.body);
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
app.listen(4000, console.log('server started'));