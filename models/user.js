const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email:{
        type: String,
        lowercase: true,
        required: [true, 'An email is required'],
        validate: [isEmail, 'that email is not correct'],
        unique: true
    },
    password:{
        type: String,
        minlength: [6, 'minimum of 6 characters in needed'],
        required: [true, 'a password is required'],
    },
    userFavourites:{
        type: Array,
        default: ['general']
    }
}, {timestamps: true});

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
            throw Error('incorrect password')
        
    }
   
        throw Error('invalid email')
}

// hash password before save
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('newsUser', userSchema);
module.exports = User;