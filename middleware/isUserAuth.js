const jwt = require('jsonwebtoken');

const userAuthentication = (req, res, next) => {
    //const authHeader = req.headers['authorization'];                         // users token 
    const token = req.cookies['refresh_token'];                         // users token 
    
    // console.log(token);
    // flag
    if (!token) {
        return res.status(401).json({error: "Please Login again..."});
    }

    // Verify that the token was generated using the secret key 
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, user) =>{
        if(error) return res.status(401).json({error: error.message});      // automaticaaly getting the error message-- after the token gets expired 
        req.user = user;                                                    // getting payload from token 
        next();                                                             //promise
    })                                                                      
}

module.exports = userAuthentication;
// exported above 