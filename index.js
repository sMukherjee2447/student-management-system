//importing the necessary packages
const express = require('express')
const req = require('express/lib/request')
const app = express()
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const studentDb = require('./model/student')
const controller = require('./controller/controller')


JWT_SECRET = 'igfiegfibcibi*&%^% fgtyr2637642749yfiwiwu36483gfuie6rwbhc78e6rf*~&^$%$^#%~hgjdgbcevcbvoU'

const port = 3000
var bodyParser = require('body-parser')

//mongoDb connection
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/student-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.json())

//All the GET routes
app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/students', async(req, res) => {
    const studentDatas = await studentDb.find()
    res.render('student-management.ejs',{ studentDatas: studentDatas })
})

app.get('/add-student', (req, res) => {
    res.render('add-student.ejs')
})

app.get('/update-student/:id', async (req, res) => {
    const id = req.params.id
    const studentDatas = await studentDb.findById(id)
    res.render('update-student', { studentDatas: studentDatas})
    // res.render('update-student.ejs')
})


//All the post Routes

//Registration
app.post('/register', async (req, res) => {
    let {
        fname,
        lname,
        email,
        password,
        password2
    } = req.body; 

    //just for my reference
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
    let errors = []

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" })
    }
    if (password.length < 6) {
        errors.push({ message: "Password must be atleast 6 charecters long" })
    }

    if (errors.length > 0) {
        res.render('register.ejs', { errors })
    } else {
        const token = await User.generateAuthToken()
        console.log("yoooo",token);
        const user = await User.findOne({ email })

        if (!user) {
            const new_user = User.create({
                fname,
                lname,
                email,
                hashed_password,
                hashed_password2,
                token
            })
    }
         else {
            errors.push({ message: "User already registered" })
            res.render('register.ejs', { errors })
        }
    }

    success.push({
        message : "You are now registered, please login"
    })
    res.redirect('/login')
    // console.log('User created successfully', new_user)

})

//login
app.post('/login', async (req, res) => {
    let {
        email,
        password
    } = req.body;

    console.log('login credentials',{
        email,
        password
    })

    let errors = []

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

// const createToken = async () => {
//     const token = await jwt.sign({ _id: "6278be5cb191ea849bb1f932" }, JWT_SECRET, {
//         expiresIn:"2 minutes"
//     })
//     console.log(token)

//     const userVer = await jwt.verify(token, JWT_SECRET)
//     console.log(userVer)
// }

// createToken();



})

//adding new student
app.post('/add-student', (req, res) => {
    let student = {
        firstname,
        lastname,
        cls,
        roll,
        dob,
        address
    } = req.body

    console.log("the inputs are", {
        firstname,
        lastname,
        cls,
        roll,
        dob,
        address
    });

    const new_student = studentDb.create({
        firstname,
        lastname,
        cls,
        roll,
        dob,
        address
    })
    res.redirect('/students')
    console.log("saved to database: ",new_student);
})

//update a student's details
app.post('/update-student/:id', async(req, res) => {


    const id = req.params.id;
    console.log(id);
    
    let student = {
        firstname,
        lastname,
        cls,
        roll,
        dob,
        address
    } = req.body

    console.log(student);
    
    const updates = await studentDb.findOneAndUpdate(
        { "_id": id },
         {
                "$set": {
                    "firstname": firstname,
                    "lastname": lastname,
                    "cls": cls,
                    "roll": roll,
                    "dob": dob,
                    "address": address
            }
        })
    res.redirect('/students')

})

//delete function
app.delete('/api/students/:id', controller.delete);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})