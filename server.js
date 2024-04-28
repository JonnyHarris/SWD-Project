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
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});
  
connection.connect((err) => {
    if (err) {
        console.log('db ' + err.message)
    }
    console.log('db ' + connection.state);
});

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const initializePassport = require('./passport-config');
const { name } = require('ejs');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = []
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,  // Dont resave session variables if nothing has changed
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); // Persist variables across entire session
app.use(methodOverride('_method'));

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
}) 
 
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})
 
app.get('/home', (req, res) => {
    let sql = 'SELECT * FROM names;';
    let qry = connection.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else 
        {        
        res.render('home.ejs', { id: req.user.id, name: req.user.name, role: req.user.role, result });
        }
    });
}); 

app.get('/add', (req, res) => {
    res.render('user_add.ejs', {
        title: 'Enter New User Information'
    }); 
});

app.post('/save', (req, res) => {
    let data = {name: req.body.name, role: req.body.role};
    let sql = 'INSERT INTO names SET ?;';
    let qry = connection.query(sql, data, (err, result) => {
        if(err) {
            console.log('throwing error /save', result);
            throw err;
        }
        res.redirect('/add');
    });
});

app.post('/update', (req, res) => {
    const userId = req.body.id;
    let data = {name: req.body.name, role: req.body.role};
    let sql = "UPDATE names SET name='" + req.body.name + "', role='" + req.body.role +"' WHERE id=" + userId + ";";
    let qry = connection.query(sql, (err, result) => {
        if(err) {
            throw err;
        }
        res.redirect('/add');
    }); 
});

app.get('/delete/:id', (req, res) => {
    let sql = 'delete from names where id=?'
    let qry = connection.query(sql, [req.params.id],  (err, result) => {
        if(err) {
               throw err;
        }
    }) 
    res.redirect('/home')
}) 


app.get('/edit/:id', (req, res) => {
    let user = "";
    const userId = req.params.id;
    let sql = `SELECT * FROM names where id=${userId}`;
    let qry = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('user_edit.ejs', {
            title: 'Edit New User Information',
            result: result[0]
        })
       });
        
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
        res.redirect('/login')
    } catch {
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
 
app.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return res.redirect('/'); // Redirect to homepage or login page
        }
        // Perform additional operations after logout if needed and perform other cleanup tasks
        // Redirect to the homepage or another appropriate page
        res.redirect('/');
    });
}); 

app.listen(3000, () => console.log(`Server running on port 3000`))