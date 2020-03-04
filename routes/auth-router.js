
const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    // res.send('logging out');
    req.logout();
    res.redirect('/login');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send('you reached the redirect URI');
    // res.send(req.user);
    res.redirect('/home/');
});

module.exports = router;