const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenSecret = require('../tokenSecret');

router.post('/register', async (req,res) => {

  // Validating data before we create a user
  const error = registerValidation(req.body);

  if(error.error) return res.status(400).send(error.error.details[0].message);

  //Check if user is already in the database

  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send('this email already exists');

  //Hash passwords - genSalt is a bcrypt function. 10 is the level of complexity. We then pass the salted password into hash as a parameter.

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Creating new user

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try{
    const savedUser = await user.save();
    res.send({user: user._id});
  }catch(err){
    res.status(400).send(err);
  }
});

//LOGIN

router.post('/login', async (req,res) => {

  const error = loginValidation(req.body);

  if(error.error) return res.status(400).send(error.error.details[0].message);

    //Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exist');

    //Checking if password is correct - using bcrypt's compare function.
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password');

    //Create and assign a token. Sign is a method specific to json web token. In Front End you have access to this ID and know your user is logged in. Attaching the token to the response.

    const token = jwt.sign({_id: user._id}, tokenSecret.secret);
    res.header('auth-token', token).send(token);

    res.send('Logged In!');

});



module.exports = router;
