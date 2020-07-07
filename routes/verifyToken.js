const jwt = require('jsonwebtoken');
const tokenSecret = require('../tokenSecret');



module.exports = function (req,res,next){
  const token = req.header('auth-token');
  if(!token) return res.status(401).send('Access Denied');

  //jwt's .verify method accepts the token and the token secret as an arguement. we have access to req.user in all of our code.

  try{
    const verified = jwt.verify(token, tokenSecret.secret);
    req.user = verified;


  }catch(err){
    res.status(400).send('INvalid Token');

  }
}
