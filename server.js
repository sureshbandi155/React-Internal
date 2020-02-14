var express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer();
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.use(upload.array());
app.use(cors());

mongoose.connect('mongodb://localhost/admin-dashboar', { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => console.log('MongoDB successfully Connected.'))
.catch( err => console.log(err) );

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    confirmPassword: String
});
var User = mongoose.model("User",userSchema, "login");

app.get('', function(req, res){
   res.send("Hello world!");
});
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
  });
app.listen(4000, console.log('server started'));