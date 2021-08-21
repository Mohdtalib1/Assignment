const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./Models/mongodb');
const session = require('express-session');
const axios = require('axios');

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({secret: process.env.SESSION_SECRET,saveUninitialized: true,resave: true}));

app.set("view engine", "ejs");
app.use(express.static("assets"));

connectDB();

app.use('/Authentication/', require('./Routes/Authentication'));
app.use('/CRUD/', require('./Routes/CRUD'));

const port = process.env.PORT || 3000;


app.get('/', function(req, res) {

  if (req.session.token) {
    if (req.session.isAdmin) {
      res.redirect('/index');
    }
    else {
      res.redirect('/UserProfile');
    }
  }
  else {
    res.redirect('/ChooseLogin');
  }


});

app.get('/add_user', function(req, res) {

  res.render('add_user', {error: ""});
});

app.get('/index', function(req, res) {

  var token = req.session.token;

  axios.get('https://cq-assignment.herokuapp.com/CRUD/AllUser',{ headers: {"Content-Type": "application/json" ,"auth-token" : token}}).then(function(response) {
    res.render('index', {users: response.data.Users});

  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  });


});

app.get('/UserSignup', function(req, res) {

  res.render('UserSignup', {error: ""});
});

app.get('/ChooseLogin', function(req, res) {

  res.render('ChooseLogin');
});

app.get('/UserLogin', function(req, res) {

  res.render('UserLogin', {error: ""});
});

app.get('/UserProfile', function(req, res) {

  var token = req.session.token;

  axios.get('https://cq-assignment.herokuapp.com/CRUD/UserInfo',{ headers: {"Content-Type": "application/json" ,"auth-token" : token}}).then(function(response) {
    res.render('UserProfile', {Users: response.data.user});
  })
  .catch(function(err) {
    console.log(err);
  });


});


app.get('/AdminLogin', function(req, res) {

  res.render('AdminLogin', {error: ""});
});

app.get('/update_user/:userId', function(req, res) {

  var token = req.session.token;

  var url = 'https://cq-assignment.herokuapp.com/CRUD/UserInfo/'+req.params.userId;

axios.get(url, { headers: {"Content-Type": "application/json" ,"auth-token" : token}})
.then(function(response) {
res.render('update_user', {user: response.data.user});
})
.catch(function(err) {
  res.send(err);
});


});

app.get('/updateSimpleUser/:userId', function(req, res) {

  var token = req.session.token;

  var url = 'http://localhost:3000/CRUD/UserInfo/'+req.params.userId;

axios.get(url, { headers: {"Content-Type": "application/json" ,"auth-token" : token}})
.then(function(response) {
res.render('updateSimpleUser', {user: response.data.user});
})
.catch(function(err) {
  res.send(err);
});


});

app.post('/update_user/:userId', function(req, res) {

  var token = req.session.token;

  var url = 'http://localhost:3000/CRUD/updateUser/'+req.params.userId;

axios.put(url,
  {
    email: req.body.email,
    password: req.body.password,
    name: req.body.username,
    phone: req.body.phone,
    gender: req.body.gender,
    bio: req.body.bio
  },
   { headers: {"Content-Type": "application/json" ,"auth-token" : token}})
.then(function(response) {
  if (response.data.success) {
    res.redirect('/index');
  }
  else {
    console.log(data.success.message);
  }

})
.catch(function(err) {
  res.send(err);
});


});

app.post('/updateSimpleUser/:userId', function(req, res) {

  var token = req.session.token;

  var url = 'http://localhost:3000/CRUD/updateUser/'+req.params.userId;

axios.put(url,
  {
    email: req.body.email,
    password: req.body.password,
    name: req.body.username,
    phone: req.body.phone,
    gender: req.body.gender,
    bio: req.body.bio
  },
   { headers: {"Content-Type": "application/json" ,"auth-token" : token}})
.then(function(response) {
  if (response.data.success) {
    res.redirect('/UserProfile');
  }
  else {
    console.log(data.success.message);
  }

})
.catch(function(err) {
  res.send(err);
});


});

app.post('/UserSignup', async function(req, res) {

  axios.post('http://localhost:3000/Authentication/signup', {
  email: req.body.email,
  password: req.body.password,
  name: req.body.username,
  phone: req.body.phone,
  gender: req.body.gender,
  bio: req.body.bio
})
.then((response) => {
  if (response.data.success) {

    req.session.token = response.data.token;
    req.session.isAdmin = false;
    res.redirect('/');
  }
  else {
    res.render('UserSignup', {error: response.data.message});
  }

}, (error) => {
  console.log(error);
});
});



app.post('/add_user', async function(req, res) {

  axios.post('http://localhost:3000/Authentication/signup', {
  email: req.body.email,
  password: req.body.password,
  name: req.body.username,
  phone: req.body.phone,
  gender: req.body.gender,
  bio: req.body.bio
})
.then((response) => {
  if (response.data.success) {

    res.redirect('/index');
  }
  else {
    res.render('add_user', {error: response.data.message});
  }

}, (error) => {
  console.log(error);
});
});

app.post('/UserProfile', async function(req, res) {
  req.session.destroy();
  res.redirect('/ChooseLogin');
});

app.post('/index', async function(req, res) {
  req.session.destroy();
  res.redirect('/ChooseLogin');
});

app.post('/UserLogin', async function(req,res) {
  axios.post('http://localhost:3000/Authentication/login', {
  email: req.body.email,
  password: req.body.password
})
.then((response) => {
  if (response.data.success) {

    req.session.token = response.data.token;
    req.session.isAdmin = false;
    res.redirect('/');
  }
  else {
    res.render('UserLogin', {error: response.data.message});
  }

}, (error) => {
  console.log(error);
});
});


app.post('/AdminLogin', async function(req,res) {
  axios.post('http://localhost:3000/Authentication/AdminAuth', {
  email: req.body.email,
  password: req.body.password
})
.then((response) => {
  if (response.data.success) {

    req.session.token = response.data.token;
    req.session.isAdmin = true;
    res.redirect('/');
  }
  else {
    res.render('AdminLogin', {error: response.data.message});
  }

}, (error) => {
  console.log(error);
});
});



app.listen(port, function(req, res) {
  console.log("Server is running on port " + port);
});
