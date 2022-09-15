const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { model, Schema } = mongoose

const userSchema = new Schema({
    username: {type: String, unique: true},
    passwordHash: String,
    canCreate: Boolean
})

userSchema.set('toJSON',{
    transform : (document,returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = model('User',userSchema)

module.exports = User