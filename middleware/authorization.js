const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    
    try {
    const authHeader = req.headers['authorization'];                             // users token 
    const token = authHeader && authHeader.split(' ')[1];                        // double checks that the autheader is not null 
    // flag
    if (token == null) {
        return res.status(401).json({error: "Null Token"});
    }
    // Verify that the token was generated using the secret key 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) =>{
        if(error) return res.status(401).json({message: "Invalid token"});       // automaticaaly getting the error message-- after the token gets expired 
        req.user = user;                                                         // getting payload from token 
        next();                                                                  //promise
    })  
    } catch (error) {
    return res.status(401).json({ error: error.message });
  }  
};
module.exports = authenticateToken;