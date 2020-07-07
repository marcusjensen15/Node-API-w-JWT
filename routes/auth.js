const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async (req,res) => {

  // Validating data before we create a user
  const error = registerValidation(req.body);

  if(error.error) return res.status(400).send(error.error.details[0].message);

  //Check if user is already in the database

  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send('this email already exists');

  //Creating new user

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try{
    const savedUser = await user.save();
    res.send(savedUser);
  }catch(err){
    res.status(400).send(err);
  }
});



module.exports = router;
