const express = require('express');
const router = express.Router();
const Register = require('../dbCollections/register');
const Deviceinfo = require('../dbCollections/deviceinfo');
const bytesToGB = require('./functions/bytesToGB');
const hashfunc = require('./functions/hashfunction');

//initialization New Method
router.post('/initializeTracking',async(req,res)=>{
    //const deviceFingerPrint = req.body.deviceFingerPrint;
    const deviceName = req.body.deviceName;
    const uid = req.body.uid;
    const ostype = req.body.ostype;
    const ram = bytesToGB(req.body.ram)+"GB";
    const storage = bytesToGB(req.body.storage)+"GB";
    const packageid = req.body.packageid;
    const batteryCap = req.body.batteryCap +"mAh";
    const countryCode = req.body.countryCode;
    const appVersionNumber = req.body.appVersionNumber;
    
    var appfound = false;
    Register.get().then(async(q)=>{
        await q.forEach(async(application)=>{
            if(application.data().packageid===packageid && application.data().appVersionNumber===appVersionNumber){
                appfound=true;
            }
        })
        if(appfound){
            const deviceFingerPrint = hashfunc(packageid+appVersionNumber+uid);
            await Deviceinfo.doc(deviceFingerPrint).set({
                "deviceFingerPrint":deviceFingerPrint,
                "deviceName":deviceName,
                "ostype":ostype,
                "ram":ram,
                "storage":storage,
                "batteryCap":batteryCap,
                "packageid":packageid,
                "countryCode":countryCode,
                "uid":uid
            });
            res.send(`app verified, deviceFingerPrint: ${deviceFingerPrint}`)
        }
        else{
            res.send("app not found");
        }
    })
})

//initialization old method
/*
router.post('/initializeTracking',async(req,res)=>{
    const deviceFingerPrint = req.body.deviceFingerPrint;
    const deviceName = req.body.deviceName;
    const ostype = req.body.ostype;
    const ram = bytesToGB(req.body.ram)+"GB";
    const storage = bytesToGB(req.body.storage)+"GB";
    const packageid = req.body.packageid;
    const batteryCap = req.body.batteryCap +"mAh";
    
    var appfound = false;
    Register.get().then(async(q)=>{
        await q.forEach(async(application)=>{
           if(application.data().deviceFingerPrint===deviceFingerPrint ){
                appfound = true;
           }
        })
        if(appfound){
            await Deviceinfo.doc().set({
                "deviceFingerPrint":deviceFingerPrint,
                "deviceName":deviceName,
                "ostype":ostype,
                "ram":ram,
                "storage":storage,
                "batteryCap":batteryCap,
                "packageid":packageid
            });
            res.send("app verified")
        }
        else{
            res.send("app not found");
        }
    })
})
*/

module.exports = router;