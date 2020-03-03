const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL:'/auth/google/redirect',
        proxy: true,
        passReqToCallback: true
        // options for google strategy
    }, (accessToken, refreshToken, profile, done) => {
   // check if user already exists in our own db
   User.findOne({googleId: profile.id}).then(currentUser => {
       if (currentUser) {
           //already have user
           console.log('user is:', currentUser);
           done(null, currentUser);
       } else {
           //if not create user in our db
           console.log(profile);
        new User({
            googleId: profile.id,
            username: profile.displayName,
            thumbnail: profile.photos.value
            // thumbnail: profile._json.image.url
        }).save().then((newUser) => {
            console.log('new user created: ', newUser);
            done(null, newUser);
        });
       }
       
   })
        // passport callback function

    })
);