// middleware/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Fisher = require('../models/Fisher');
const bcrypt = require('bcrypt');

const initialize = () => {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                try {
                    const user = await Fisher.findOne({ email });
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email.' });
                    }

                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Fisher.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

module.exports = initialize;
