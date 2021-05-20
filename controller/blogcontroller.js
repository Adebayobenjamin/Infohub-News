const NewsAPI = require('newsapi');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const dotenv = require('dotenv');

//dotenv
dotenv.config();
// news api
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
module.exports.blogs_get = (req, res, next)=>{
  const token = req.cookies.infoHub;
  if(token){
    const auth = jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
      if(err){
        newsapi.v2.topHeadlines({
          category: 'general',
          language: 'en'
          
         }).then(response => {
          res.render('index', {data: response})
         });
      }
      else{
        User.findById(decodedToken.id).then(user=>{
          if(user.userFavourites.length == 0){
            newsapi.v2.topHeadlines({
              category: 'general',
              language: 'en'
              
             }).then(response => {
              res.render('index', {data: response})
             });
          }else{
            newsapi.v2.topHeadlines({
              category: user.userFavourites,
              language:'en'
              
             }).then(response => {
              res.render('index', {data: response})
             });
          }
         
         
        })
      }
    })
  }else{
    newsapi.v2.topHeadlines({
      category: 'general',
      language: 'en',
      
     }).then(response => {
      res.render('index', {data: response})
     });
  }
}

// Get categories
module.exports.categories_get = (req, res)=>{
  var queryUrl = req.query.category || req.query.s
  console.log(queryUrl)
  newsapi.v2.topHeadlines({
    category: queryUrl,
    language: 'en',
  }).then(response => {
    console.log(queryUrl)
    res.render('category', {data: response.articles, category: queryUrl});
 
  }).catch(err=> console.log(err.message));
  
  }
  

// get reader

module.exports.reader_get = (req, res, next) =>{
  const q = req.query.q;
  const mainUrl = req.query.link;
  newsapi.v2.everything({
    q: q,
    language: 'en',
  }).then(response => {
    if(response.totalResults < 1){
      res.redirect(mainUrl)
    }else{
    res.render('reader', {data: response})
    }
  })
}
module.exports.profile_get = (req, res, next)=>{
  res.render('profile')
};

module.exports.about_get = (req, res, next)=>{
  res.render('about');
}