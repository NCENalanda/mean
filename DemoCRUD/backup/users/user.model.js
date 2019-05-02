const joi = require('joi');
const mongoose = require('mongoose');

//const Schema = mongoose.Schema;

const schema = new Schema({
    //const User = mongoose.model('User', new Schema({
    firstname: { 
        type: String,  
        required: true,
        minlength:3,
        maxlength:50,
     },
     lastname: { 
        type: String,  
        required: true,
        minlength:3,
        maxlength:50,
     },
    
     email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    role:{
        type : String,
        default: "USER"
    },
    createdBy: { 
        type: Date, 
        default: Date.now 
    },
    active: {
        type : Boolean,
        default: false
    }
});

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}
 
//exports.User = User;
exports.validate = validateUser;

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', schema);




/*
const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));
*/