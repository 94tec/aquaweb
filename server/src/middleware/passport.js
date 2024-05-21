const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User.js');
const Fisher = require('../models/Fisher.js');
const bcrypt = require('bcrypt');

function initialize(passport) {
    // Local strategy for User
    passport.use('local-user', new LocalStrategy(
        async function(username, password, done) {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Local strategy for Fisher
    passport.use('local-fisher', new LocalStrategy(
        async function(username, password, done) {
            try {
                const fisher = await Fisher.findOne({ username });
                if (!fisher) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                const match = await bcrypt.compare(password, fisher.password);
                if (!match) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, fisher);
            } catch (error) {
                return done(error);
            }
        }
    ));

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    // JWT strategy for User
    passport.use('jwt-user', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    // JWT strategy for Fisher
    passport.use('jwt-fisher', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const fisher = await Fisher.findById(jwt_payload.id);
            if (fisher) {
                return done(null, fisher);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            if (!user) {
                user = await Fisher.findById(id);
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initialize;
