const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const res = require('express/lib/response')

JWT_SECRET = "kjdbnkjdbnkjdsavnburewhuoy7456dkjbnkjb&^$&^&#%bhbfarbvkjsbadvkj"

const userSchema = new mongoose.Schema({
    fname:
    {
        type: String, required: true
    },

    lname:
    {
        type: String, required: true
    },
    
    email:
    {
        type: String, required: true
    },
    
    hashed_password:
    {
        type: String, required: true
    },
    
    hashed_password2:
    {
        type: String, required: true
    },

    token:
    {
        type: String,
        required: true
    }
    
}, { collection: 'users' })

userSchema.statics.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, "iuefkjBCVghueyhfkjBANDgfhhekbnavkjbnkjrfhughrhawhf")
        console.log(token)
        return token
    } catch (error) {
        res.send("There error part" + error);
        console.log("the error" +error);
    }
}


const model = mongoose.model('UserSchema', userSchema)

module.exports = model