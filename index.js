const express = require('express')
const req = require('express/lib/request')
const app = express()
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


JWT_SECRET = 'igfiegfibcibi*&%^% fgtyr2637642749yfiwiwu36483gfuie6rwbhc78e6rf*~&^$%$^#%~hgjdgbcevcbvoU'

const port = 3000
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/student-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/students', (req, res) => {
    res.render('student-management.ejs')
})

app.post('/register', async (req, res) => {
    let {
        fname,
        lname,
        email,
        password,
        password2
    } = req.body;

    console.log({
        fname,
        lname,
        email,
        password,
        password2
    });

    const hashed_password = await bcrypt.hash(password, 10)
    const hashed_password2 = await bcrypt.hash(password2, 10) 

    let success = []
    const new_user = User.create({
        fname,
        lname,
        email,
        hashed_password,
        hashed_password2
    })
    success.push({
        message : "You are now registered, please login"
    })
    // res.render('login.ejs',success)
    console.log('User created successfully', new_user)

})

app.post('/login', async (req, res) => {
    let {
        email,
        password
    } = req.body;

    console.log('login credentials',{
        email,
        password
    })

    const user = await User.findOne({ email })
    // console.log(user)
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.hashed_password, function (err, result) {
                    if (err) {
                        res.json({
                        error:err
                    })
                    }
                    if (result) {
                        let token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' })
                        res.redirect('/students')
                    } else {
                        res.json({
                            message: 'passwords did not match'
                        })
                    }
            })
            } else {
                res.json({
                    message: 'no user found'
                })
        }
    })


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})