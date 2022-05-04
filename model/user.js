const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },

    lname: { type: String, required: true },
    
    email: { type: String, required: true },
    
    hashed_password: { type: String, required: true },
    
    hashed_password2: { type: String, required: true }
    
}, { collection: 'users' })


const model = mongoose.model('UserSchema', userSchema)

module.exports = model