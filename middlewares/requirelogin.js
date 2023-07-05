//middleware for restricted links
const requirelogin = async (req,res,next)=>{
    if(!req.session.user){
        return res.send("you are not logged in");
    }
    next();
}

module.exports = requirelogin;