const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const users = require('../Models/users');
const Admin = require('../Models/Admin');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

router.post('/signup', async function(req, res, next) {

   var password = req.body.password;
   var hash = await crypto.createHash('sha1').update(password).digest('hex');
   var email = req.body.email;

   const emailExist = await users.findOne({email: email});

   if (emailExist) {
     return res.json({
       success: false,
       message: "Email Already Exists!"
     });
   }

  const user = new users({
    name: req.body.name,
    email: email,
    phone: req.body.phone,
    password: hash,
    gender: req.body.gender,
    bio: req.body.bio
  });

  user
  .save()
  .then(result => {
       const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token: token
    });

  })
  .catch(err => {
    res.json({
      success: false,
      message: "Some type of error occured"
    });
  });
});


router.post('/login', async function(req, res, next) {

   var password = req.body.password;
   var email = req.body.email;

   const User = await users.findOne({email: email});

   if (!User) {
     return res.json({
       success: false,
       message: "Email Not Exists! Please Create a new Account"
     });
   }

     var passwordFromDatabase = User.password;
     var hash = await crypto.createHash('sha1').update(password).digest('hex');

       if (passwordFromDatabase == hash) {
         const token = jwt.sign({_id: User._id}, process.env.SECRET_TOKEN);
         // res.header('auth-token', token).send(token);
         res.status(200).json({
           success: true,
           message: "Login successful",
           token: token
         });
       } else {
         return res.json({
           success: false,
           message: "Wrong password"
         });
       }

});

router.post('/AdminAuth', async function(req, res, next) {

   var password = req.body.password;
   var email = req.body.email;

   const Admin1 = await Admin.findOne({email: email});

   if (!Admin1) {
     return res.json({
       success: false,
       message: "Email Not Exists! Please Create a new Account"
     });
   }

     var passwordFromDatabase = Admin1.password;

       if (passwordFromDatabase == password) {
         const token = jwt.sign({_id: Admin1._id}, process.env.SECRET_TOKEN);
         // res.header('auth-token', token).send(token);
         res.json({
           success: true,
           message: "Login successful",
           token: token
         });
       } else {
         return res.json({
           success: false,
           message: "Wrong password"
         });
       }

});


module.exports = router;
