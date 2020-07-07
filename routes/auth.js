const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs')

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



module.exports = router;
