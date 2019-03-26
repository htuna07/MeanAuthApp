const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//mongose connection
mongoose.connect(config.database,{useNewUrlParser: true});

//connection successfull
mongoose.connection.on('connected',function(){
    console.log("MongoDB " + config.database + " noktasına bağlandı.")
});

//connection failed
mongoose.connection.on('error',function(error){
    console.log("Hata : " + error);
});

//import users.js
const users = require('./routes/users');

//main app
const app = express();

//portnumber
const portNumber = process.env.PORT || 8080;

//cors middleware
app.use(cors());

//body-parser middleware
app.use(bodyParser.json());


//use users.js if link is /users
app.use('/users',users);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

//make frontend public
app.use(express.static(path.join(__dirname,'public')));


app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'public/index.html'));
});



//listen the port of portNumber
app.listen(portNumber,function(){
    console.log("Sunucu " + portNumber + ". portta çalışıyor.");
})


