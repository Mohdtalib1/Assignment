const express = require('express');
const verify = require('../Models/verifyToken');
const users = require('../Models/users');
const crypto = require('crypto');
const router = express.Router();

router.get('/UserInfo/:userId', verify, async function(req, res) {
  var userId = req.params.userId;
  const User = await users.findOne({_id: userId});
  res.json({
    success: true,
    message: "Data Retrieved Successfully",
    user: User
  });
});

router.get('/UserInfo', verify, async function(req, res) {

  const User = await users.findOne({_id: req.User._id});
  res.status(201).json({
    success: true,
    message: "Data Retrieved Successfully",
    user: User
  });
});

router.get('/AllUser', verify, async function(req, res) {

  users.find({},function(err,data){
  // Mongo command to fetch all data from collection.
      if(err) {
        res.json({
          success: false,
          message: err
        });
      } else {
        res.status(201).json({
          success: true,
          message: "Data Retrieved Successfully",
          Users: data
        });
      }


});
});

router.delete('/DeleteUser/:userId', async function(req,res) {

   var userId = req.params.userId;

  users.findByIdAndRemove(userId)
    .then(data => {
      if (!data) {
        res.json({
          success: false,
          message: `Cannot delete User with id=${userId}. Maybe User was not found!`
        });
      } else {
        res.json({
            success: true,
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.json({
          success: false,
        message: "Could not delete user with id=" + userId
      });
    });
});



router.put('/updateUser/:id', async(req, res, next) => {

  if (!req.body) {
    return res.json({
      success: false,
      message: "Data to update can not be empty"
    })
  }

  try {
    let User = await users.findById(req.params.id);
    if (!User) {
      return res.json({
        success: false,
        message: "User not exists"
      });
    }

    var password;

    if (req.body.password.length < 18) {
      password = await crypto.createHash('sha1').update(req.body.password).digest('hex');
    }
    else {
      password = req.body.password;
    }



    var bodyData =  {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: password,
      gender: req.body.gender,
      bio: req.body.bio
    }

    User = await users.findByIdAndUpdate(req.params.id, bodyData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      User: User,
      message: "Successfuly updated"
    });



  } catch (e) {
    next(e);
  }
});


module.exports = router;
