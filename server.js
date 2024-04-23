if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require('./passport-config')
const { name } = require('ejs')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,  // Dont resave session variables if nothing has changed
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())  // Persist variables across entire session
app.use(methodOverride('_method'))

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
}) 
 
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
 
app.get('/home', checkAuthenticated, (req, res) => {
  
    res.render('home.ejs', { name: req.user.name })
    console.log('user name=', { name: req.user.name })
}) 

app.post('/login', passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/home',   
    failureRedirect: '/login',  
    failureFlash: true
}))

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
        users.push({ 
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log('* going to login')
        res.redirect('/login')
    } catch {
        console.log('* going to register')
        res.redirect('/register')
    }
})

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}

function checkNotAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next()
}
 
app.delete('/logout', (req, res) => {
    req.logout() 
    res.redirect('/')
})


app.listen(3000, () => console.log(`Server running on port 3000`))