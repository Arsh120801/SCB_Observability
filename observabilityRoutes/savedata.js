const express = require('express');
const Data = require('../dbCollections/data');
const router = express.Router();

//user journey related data
router.post('/savedata',async(req,res)=>{
    const deviceFingerPrint = req.body.deviceFingerPrint;
    const data =req.body.data;
    /*
        here data is the object which conatains many key-value pairs, like:
            data={
                "btnName":"login",
                "path":"login/home/transactionlist",
                "userid":"qwerty"
            }
    */ 
    
    const prevData = await Data.doc(deviceFingerPrint).get().then(doc => doc.data()?.appData);
    if(prevData){
        await Data.doc(deviceFingerPrint).update({
            appData: [...prevData, {
                "data":data
            }]
        })
        res.send("User Journey Saved");
    }
    else{
        await Data.doc(deviceFingerPrint).set({
            appData: [{
                "data":data
            }]
        })  
        res.send("User Journey Saved")     ;         
    }          
})

module.exports = router;