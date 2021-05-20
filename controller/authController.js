const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

//dotenv
dotenv.config();


const maxAge = 3 *60 * 60 * 24;
const CreateToken = (id) =>{
return jwt.sign({id}, process.env.JWT_SECRET, {
   expiresIn: maxAge
})
}

const errors = {email: '', password:''}
const handleErrors = (err)=>{

    // invalid email
    if(err.message === 'invalid email'){
        errors.email = 'invalid email';
        return errors;
    }

    if(err.message === 'incorrect password'){
        errors.password = 'incorrect password';
        return errors;
    }
    
    // duplicate Key error
    if(err.code === 11000){
        errors.email = "that email already exists";
    }
    // user validation failed
    if(err.message.includes('newsUser validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            return errors;
        })
    }

    console.log(err.message)
    return errors;
}

module.exports.login_get = (req, res, next)=>{
    res.render('login')
};

//login

module.exports.login_post = async (req, res, next)=>{
    const {email , password} = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = CreateToken(user._id);
        res.cookie('infoHub', token, {httpOnly: true, maxAge: maxAge *1000});
        res.status(200).json({user});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}

module.exports.signup_get = (req, res, next)=>{
    res.render('signup')
};

//signup

module.exports.signup_post = (req, res, next)=>{
    User.create(req.body).then(user=>{
       const token = CreateToken(user._id);
       res.cookie('infoHub', token, {httpOnly: true, maxAge: maxAge * 1000})

        // send user as sucess response
        res.status(200).json({user});
    }).catch(err=>{
        const errors = handleErrors(err);
        res.status(400).json({errors})
    })

}

//logout
module.exports.logout_get = (req, res, next)=>{
    res.cookie('infoHub', null, {httpOnly: true, maxAge: 1});
    res.redirect('/login');
}

//update user
module.exports.update_user = (req, res, next)=>{
    const token = req.cookies.infoHub;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
        if(err){
            res.redirect('/login')
        }else{
            // check who the current user is
            const currentUser = await User.findById(decodedToken.id);

            // get details and handle errors
            var {email, password,  userFavourites} = req.body;
            if(email === ''){
                errors.email = 'please enter an email';
                errors.password = '';
                res.status(400).json({errors})
            }else{
            if(password === '' ){
                errors.password = 'please enter your password';
                errors.email = '';
                res.status(400).json({errors})
            }else if(password.length < 8){
                errors.password = 'minimum of 6 characters is needed';
                errors.email = '';
                res.status(400).json({errors})
            }
            else{
                const checkUser = await User.findOne({email});
                if(checkUser){
                 if(checkUser.email === currentUser.email){
                     // hash password
                    const salt = await bcrypt.genSalt();
                    password = await bcrypt.hash(password, salt);
                    // update user
                   User.findByIdAndUpdate(decodedToken.id, {
                        email, password, userFavourites
                    }).then(user=>{
                        res.status(200).json({user})
                    }).catch(err=>{
                        const errors = handleErrors(err);
                        res.status(400).json({errors})
                    })
                 }else{
                     errors.email = "That user already exists";
                     errors.password = "";
                     res.status(400).json({errors})
                 }
                }else{
                    // hash password
                    const salt = await bcrypt.genSalt();
                    password = await bcrypt.hash(password, salt);
                    // update user
                   User.findByIdAndUpdate(decodedToken.id, {
                        email, password, userFavourites
                    }).then(user=>{
                        res.status(200).json({user})
                    }).catch(err=>{
                        const errors = handleErrors(err);
                        res.status(400).json({errors})
                    })
                    
                }
            }
         }
        }
    }) 
  
}


module.exports.delete_user = (req, res, next)=>{
    const id = req.params.id;
    User.findByIdAndDelete(id).then(user=>{
        res.cookie('infoHub', '', {httpOnly:true, maxAge: 1})
        res.status(200).json({location: '/'});
    }).catch(err=>{
        console.log(err.message)
    })
}