const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
	try {
		let user = await User.findOne({ email: profile.emails[0].value });
		if (!user) {
			user = new User({ email: profile.emails[0].value, password: '' });
			await user.save();
		}
		return done(null, user);
	} catch (err) {
		return done(err, null);
	}
}));

// Express route handlers for Google OAuth
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
exports.googleCallback = passport.authenticate('google', { failureRedirect: '/login' });
