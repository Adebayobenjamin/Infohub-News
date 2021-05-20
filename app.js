const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const blogRoutes = require('./router/blogRoutes');
const {checkUser} = require('./middleware/authmidleware')
const url = require('url');
const authRoutes = require('./router/authRoutes');
const contactRoute = require('./router/contactRoute');

// initialise app
const app = express();

const dbUri = "mongodb+srv://drell23:test1234@cluster0.slgfd.mongodb.net/Node-tuts?retryWrites=true&w=majority";

mongoose.connect(dbUri, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result=> console.log('connected to db')).catch(err=> console.log(err.message))

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))


// view engine
app.set('view engine', 'ejs');


app.listen(port, console.log(`listening for requests on ports ${port}`));

// routes
app.get('*', checkUser)
app.use(blogRoutes);
app.use(authRoutes);
app.use(contactRoute)
app.use((req, res)=>{
  res.status(404).render('404');
})