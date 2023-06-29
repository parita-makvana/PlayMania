const jwt = require('jsonwebtoken');

const userAuthentication = async (req, res, next) => {
    try {
    const token = req.cookies['refresh_token'];                                         // users token 
    if (!token) {
        return res.status(401).json({error: "Please Login again..."});
    }
    // Verify that the token was generated using the secret key --- 
    try {
    const user = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        req.user = user;                                                                   // getting payload from token 
        next();                                                                         //promise
    } catch (error) {
   return res.status(401).json({ error: error.message }); // Automatically getting the error message after the token expires
    } 
    } catch (error) {
    return res.status(401).json({ error: error.message });
    }                                                                      
}

module.exports = userAuthentication;