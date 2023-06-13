const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    //const authHeader = req.headers['authorization'];                         // users token 
    const authHeader = req.headers['authorization'];                         // users token 
    
    // console.log(req.headers);
    const token = authHeader && authHeader.split(' ')[1];                   // double checks that the autheader is not null 
    
    // console.log(token);
    
    // flag
    if (token == null) {
        return res.status(401).json({error: "Null Token"});
    }
    // Verify that the token was generated using the secret key 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) =>{
        if(error) return res.status(401).json({error: error.message});      // automaticaaly getting the error message-- after the token gets expired 
        req.user = user;                                                    // getting payload from token 
        next();                                                             //promise
    })                                                                      
}

module.exports = authenticateToken;
 
// exported above 