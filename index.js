//importing the necessary packages
require('dotenv').config()
const express = require('express')
const req = require('express/lib/request')
const app = express()
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const studentDb = require('./model/student')
const controller = require('./controller/controller')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

//mongoDb connection
var mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.json())

//function to authenticate User through cookies
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.JWT
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
        console.log(verifyUser);

        const user_data = await User.findOne({ token: verifyUser.token })
        console.log(user_data)

        req.token = token
        req.user_data = user_data

        next()
    } catch (error) {
        res.status(401).send(error)
    }
}

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

app.get('/students', auth, async (req, res) => {
    console.log("The login cookie-->>", req.cookies.JWT )
    const studentDatas = await studentDb.find()
    res.render('student-management.ejs', { studentDatas: studentDatas })
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

app.get("/logout", auth, async (req,res) => {
    try {
        res.clearCookie("JWT")
        
        console.log("logout successful")

        await req.user_data.save()
        
        res.redirect('/login')
    
    } catch (error) {
        res.status(500).send(error)
    }
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
        const register_token = await User.generateAuthToken()
        console.log("yoooo", register_token);
        
        res.cookie("JWT", register_token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        })

        const user = await User.findOne({ email })

        if (!user) {
            const new_user = User.create({
                fname,
                lname,
                email,
                hashed_password,
                hashed_password2,
                register_token
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
            if (user) {
                const isMatch = bcrypt.compare(password, user.hashed_password)

                    const login_token = await User.generateAuthToken()
                    console.log("yoooo sign in", login_token);

                    res.cookie("JWT", login_token, {
                        expires: new Date(Date.now() + 300000),
                        httpOnly: true
                    })
                
                    if (isMatch) {
                        res.redirect('/students')
                    } else {
                        res.json({ message: "Passwords do not match" })
                    }
            } else {
                res.json({
                    message: 'no user found'
                })
        }
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