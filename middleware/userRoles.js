const userRole=(...roles)=>{
    return (req,res,next)=>{
        const user=req.user;
        const isUserAccesed= roles.includes(user.role);
        if(!isUserAccesed){  
            return res.status(401).json({message: "Cannot access this resource"});
        }
        return next();
    }   
}

module.exports = userRole;