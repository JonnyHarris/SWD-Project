const express = require('express')
const app = express()
const { authenticate } = require('passport')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const session = require('express-session')

const LocalStrategy = require('passport-local').Strategy

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,  // Dont resave session variables if nothing has changed
    saveUninitialized: false
}))


function initialize(passport, getUserByEmail, getUserByID) {
    const authenticateUser = async (email, password, done) => {
     
        const user = getUserByEmail(email)
       
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user) // return user with valid password
            } else {
                return done(null, false,{ message: 'Password incorrect' })
            }
        } catch (e) {
                return done(e)
        }

    }

    passport.use(new LocalStrategy({ usernameField: 'email' },
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id))
     })

}

module.exports = initialize