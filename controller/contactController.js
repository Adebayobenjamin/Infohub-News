const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


// create client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// set credentials

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});


module.exports.contact_get = (req, res, next) =>{
    res.render('contact')
}

module.exports.contact_post = (req, res, next)=>{
    // errors
    const errors = {email:'', subject: '', message: ''}
    if(req.body.email == ''){
        errors.email = 'Please enter your email'
        res.status(400).json({errors})
    }else if(req.body.subject == ''){
        errors.subject = 'please enter a subject';
        res.status(400).json({errors})
    }else if(req.body.message == ''){
        errors.message = 'Please enter your message';
        res.status(400).json({errors})
    }else{

        console.log(req.body)
    
  oAuth2Client.getAccessToken().then(accessToken=>{

    // create transport with node mailer

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            type: "OAuth2",
            user: "jeezyfresh6@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: `${req.body.name}, <${req.body.email}>`,
        to: `adebayo.benjamin.business@gmail.com`,
        subject: `< ${req.body.email} > ${req.body.subject}`,
        text: `${req.body.message}`
    }

    transport.sendMail(mailOptions).then(result=>{
        res.status(200).json({result})
        console.log( " email sent" + result.envelope)
    })
  }).catch(err=>{
      console.log(err=>{
        err.message
      })
  })
}
}