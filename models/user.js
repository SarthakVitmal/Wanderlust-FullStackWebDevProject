const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : false
    },
    googleId : {
        type : String,
        required : false,
    },
    isEmailVerified : {
        type: Boolean,
        default: false,
    }
})

userSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model('User', userSchema);
