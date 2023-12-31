const express = require('express');
const router = express.Router();
const Register = require('../dbCollections/register');
const Deviceinfo = require('../dbCollections/deviceinfo');
const bytesToGB = require('./functions/bytesToGB');
const hashfunc = require('./functions/hashfunction');

//initialization

/*Deviceinfo is a firestore data collection which will store the device information
The document Id for this device data in deviceinfo collection will be deviceFingerPrint*/

router.post('/initializeTracking',async(req,res,next)=>{
    const deviceName =( req.body.deviceName || "N/A");
    const uid = req.body.uid;
    const ostype = req.body.ostype;
    let ram = (req.body.ram || "N/A");
    if( ram!=="N/A" && ostype.substring(0,3)!=="iOS"){
        ram = bytesToGB(req.body.ram)+" GB";
    }
    let storage =( req.body.storage || "N/A");
    if( storage!=="N/A" && ostype.substring(0,3)!=="iOS"){
        storage = bytesToGB(req.body.storage)+" GB";
    }
    
    const packageid = req.body.packageid;
    const batteryCap = (req.body.batteryCap ? req.body.batteryCap +" mAh" : "N/A");
    const countryCode = (req.body.countryCode || "N/A");
    const appVersionNumber = req.body.appVersionNumber;

    var appfound = false;
    Register.get().then(async(q)=>{
        try{
            
            if (!req.body.uid || !req.body.ostype || !req.body.packageid || !req.body.appVersionNumber) {
                const error = new Error("Required field/s is/are missing.");
                error.statusCode = 400;
                throw error;
            }

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
        }catch(error){
            next(error);
        }
    })
})

module.exports = router;