const jwt = require('jsonwebtoken');

const jwtTokens = ({user_id, username, email}) => {
    const user = {user_id, username, email};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_TIME});    // 15 mins --  in real scenerio
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_TIME}); // 14 days -- in real scenerio
    return ({accessToken, refreshToken});
}

// export {jwtTokens};
module.exports = jwtTokens;