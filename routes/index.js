const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/',ensureAuthenticated, (req,res,next)=>{

    Article.getArticles((err,articles)=>{

    res.render('index', {

        articles:articles,
        title: 'Musicians\' Hangout'
    })
    },4);
});

router.get('/register', (req,res,next)=>{

    res.render('register', {
        title: 'Register'
    })
});

//Process Registration
router.post('/register', (req, res, next) =>{
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email must be a valid email address').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    let errors = req.validationErrors();

    if(errors){
      res.render('register', {
         errors:errors,

      });

    } else{
      const newUser = new User({
        name: name,
        username:username,
        email:email,
        password:password

      }); 

      User.registerUser(newUser, (err,user)=>{
        if (err) throw err;
        req.flash('success', 'You are registered and can login')
        res.redirect('/login');
      });
    };
});

router.get('/login', (req,res,next)=>{

    res.render('login', {
        title: 'Login'
    })
});

//Local Strategy
passport.use(new LocalStrategy((username,password,done)=>{
    User.getUserByUsername(username, (err,user) =>{
      if(err) throw err;
      if(!user){
        return done(null,false,{message: 'User does not exist'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else{
          return done(null, false, {message: 'Wrong Password'});
        }
      });
    });
  }));
  
  // Serialize User
  passport.serializeUser((user,done)=>{
    done(null, user.id);
  });
  
  passport.deserializeUser((id,done)=>{
    User.getUserById(id, (err,user) =>{
      done(err,user);
    });
  });
  
  //login in processing
  router.post('/login', (req, res, next) =>{
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })(req,res,next);
  });

  //Logout
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success','You are logged out');
    res.redirect('/login'); 
  });
  
  //Access control
  function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return next();
    } else{
      req.flash('error', 'You are not Logged in!')
      res.redirect('/login');
    }
  }


module.exports = router;

