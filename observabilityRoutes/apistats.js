const express = require('express');
const router = express.Router();
const requirelogin = require('../middlewares/requirelogin');
const bytesToGB = require('./functions/bytesToGB');
const formatTimestamp = require('./functions/formatTimestamp');
const Apistats = require('../dbCollections/apistats');
const User = require('../dbCollections/user');
const Deviceinfo = require('../dbCollections/deviceinfo');

//API statastics
router.post('/apistats',requirelogin,async(req,res,next)=>{
    try{

        if (!req.body.packageid || !req.body.deviceFingerPrint || !req.body.apicalled) {
            const error = new Error("Required field/s is/are missing.");
            error.statusCode = 400;
            throw error;
          }

        const deviceFingerPrint = req.body.deviceFingerPrint;
        const ramUsed =((req.body.ramUsed) ? bytesToGB(req.body.ramUsed)+" GB":"N/A");
        const upspeed=(req.body.upspeed ? req.body.upspeed+ " Mb/Sec":"N/A");
        const downspeed=(req.body.downspeed ? req.body.downspeed+ " Mb/Sec":"N/A");
        const reqtime=((req.body.reqtime) ? formatTimestamp(Number(req.body.reqtime)) + " ms":"N/A");
        const restime=((req.body.restime) ? formatTimestamp(Number(req.body.restime)) + " ms":"N/A");
        const parsetime = (req.body.parsetime ? req.body.parsetime + " ms":"N/A");
        const rendertime = (req.body.rendertime ? req.body.rendertime + " ms":"N/A");
        const packageid=req.body.packageid;
        const battery=(req.body.battery ? req.body.battery + " %":"N/A");
        const apicalled = req.body.apicalled;
        const batterytemp = (req.body.batterytemp ? req.body.batterytemp + " °C" : "N/A");
        const NetworkType = (req.body.NetworkType || "N/A");
        const NetworkOperator = (req.body.NetworkOperator || "N/A");
        const Context = (req.body.Context || "N/A");
        const Event = (req.body.Event || "N/A");

        // if session is storing email id instead of user id
        const email = req.session.user.email;
        let userid="";
        await User.doc(email).get().then((user)=>{
            userid = user.data().userid;
        });

        /* if session is storing user id then replace the code with the below
        const userid = req.body.userid;
        */

        // Checking whether the deviceFingerPrint is already there in database or not.
        const deviceExists = Deviceinfo.doc(deviceFingerPrint);
        const snapshot = await deviceExists.get();

        if(snapshot.data()===undefined){
            return res.send("device not found!");
        }

        else{
            await Apistats.doc().set({
                "ramUsed":ramUsed,
                "upspeed":upspeed,
                "downspeed":downspeed,
                "reqtime":reqtime,
                "restime":restime,
                "rendertime":rendertime,
                "userid":userid,
                "packageid":packageid,
                "battery":battery,
                "deviceFingerPrint" :deviceFingerPrint,
                "parsetime":parsetime,
                "apicalled":apicalled,
                "NetworkType":NetworkType,
                "NetworkOperator":NetworkOperator,
                "Context":Context,
                "Event":Event,
                "batterytemp":batterytemp
            });
            res.send("Dynamic Device information Added")
        }
}catch(error){
    next(error);
}
})

module.exports = router;