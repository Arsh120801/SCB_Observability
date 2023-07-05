const express = require('express');
const router = express.Router();
const requirelogin = require('../middlewares/requirelogin');
const bytesToGB = require('./functions/bytesToGB');
const formatTimestamp = require('./functions/formatTimestamp');
const Apistats = require('../dbCollections/apistats');
const User = require('../dbCollections/user');

//API statastics
router.post('/apistats',requirelogin,async(req,res)=>{
    const deviceFingerPrint = req.body.deviceFingerPrint;
    const ramUsed = bytesToGB(req.body.ramUsed)+" GB";
    const upspeed=req.body.upspeed + " Mb/Sec";
    const downspeed=req.body.downspeed + " Mb/Sec";
    const reqtime=formatTimestamp(Number(req.body.reqtime));
    const restime=formatTimestamp(Number(req.body.restime));
    const parsetime = req.body.parsetime + " ms";
    const rendertime=req.body.rendertime + " ms";
    const packageid=req.body.packageid;
    const battery=req.body.battery + "%";
    const apicalled = req.body.apicalled;
    const batterytemp = req.body.batterytemp + "°C";
    const NetworkType = req.body.NetworkType;
    const NetworkOperator = req.body.NetworkOperator;
    const Context = req.body.Context;
    const Event = req.body.Event;
    const email = req.body.email;
    let userid="";
    await User.doc(email).get().then((user)=>{
        userid = user.data().userid;
    });


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
})

module.exports = router;