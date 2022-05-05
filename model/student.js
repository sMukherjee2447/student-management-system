const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    cls: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})

const studentDb = mongoose.model('studentdb', studentSchema)

module.exports = studentDb