const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Registering page
router.post('/register',function(req,res,next){
    let newUser = new User({
        name : req.body.name,
        email : req.body.email,
        username : req.body.username,
        password : req.body.password,

    });
    User.addUser(newUser,function(err,user){
        if(err)
            res.json({ success : false , msg : 'Failed to register user.'});
        else
        res.json({ success : true , msg : 'User registered.'});
    })
})

//Authentication page
router.post('/authenticate',function(req,res,next){
    const username = req.body.username ;
    const password = req.body.password ;

    User.getUserByUserName(username,function(err,user){
        if(err) throw err;
        if(!user){
            return res.json({success : false, msg : "User Not Found."});
        }
        User.comparePassword(password,user.password,function(err,isMatch){
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(),config.secret,{
                    expiresIn : 604800 // a week
                });
                res.json({
                    success : true,
                    token : 'JWT ' + token,
                    user : {
                        id : user._id,
                        name : user.name,
                        username : user.username,
                        email : user.email
                    }
                })
            }
            else{
                return res.json({success : false, msg : "Wrong Password"});
            }

            

        })
    })
})

//Profile Page
router.get('/profile',passport.authenticate('jwt' , {session:false}),function(req,res,next){
    res.json({user : req.user});
})



module.exports = router;