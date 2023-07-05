//middleware for checking the corelationid in header
const checkheader = async (req,res,next)=>{
    if(req.header.corelationid===null){
        return res.send("Corelationid not found in header");
    }
    else{
        next();
    }
}

module.exports = checkheader;