const express = require('express')
const req = require('express/lib/request')
const app = express()
const User = require('./model/user')
const bcrypt = require('bcryptjs')

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

    // let errors = []

    // if (password.length < 6) {
    //     errors.push({
    //         message: "Password is too small. Should be atleast 6 charecters long"
    //     })
    // }

    // if (password != password2) {
    //     errors.push({
    //         message: "Passwords do not match"
    //     })
    // }

    // if (errors.length > 0) {
    //     res.render('register.ejs', {
    //         errors
    //     })
    // }


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
    res.render('login.ejs', {
        success
    })
    console.log('User created successfully', new_user)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})