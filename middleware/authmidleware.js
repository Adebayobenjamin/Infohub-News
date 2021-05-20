const jwt = require('jsonwebtoken');
const User = require('../models/user')
const dotenv = require('dotenv');

//dotenv
dotenv.config();


module.exports.requireAuth = (req, res, next)=>{
    const token = req.cookies.infoHub;
     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
        if(err){
            res.redirect('/login')
        }else{
            next();
        }
    })
};
// check user
module.exports.checkUser = (req, res, next)=>{
    const token = req.cookies.infoHub;
   if(token){
    jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken)=>{
        if(err){
            res.locals.user = null;
            next();
        }else{
          const user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      })
   }else{
       res.locals.user =null;
       next();
   }
}
