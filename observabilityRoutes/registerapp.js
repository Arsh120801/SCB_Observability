const express = require('express');
const router = express.Router();
const hashfunc = require('./functions/hashfunction');
const Register = require('../dbCollections/register');

//Register App New Method
router.post('/registerapp',async(req,res)=>{
    const appid = req.body.appid;
    const platform = req.body.platform;
    const packageid = appid+platform;
    const appVersionNumber = req.body.appVersionNumber;

    let appregistered = false;

    Register.get().then(async(q)=>{
        q.forEach(async(registerapp)=>{
            if(registerapp.data().packageid===packageid && registerapp.data().appVersionNumber===appVersionNumber){
                appregistered=true;
            }
        })

        if(!appregistered){
            await Register.doc().set({
                "appid":appid,
                "platform":platform,
                "packageid":packageid,
                "appVersionNumber":appVersionNumber
            })
            res.send('Application Registered')
        }
        else{
            res.send('Application Is Already Registered!')
        }
    })
})



//Register App Old Method
/*
router.post('/registerapp',async(req,res)=>{
    const appid = req.body.appid;
    const uid = req.body.uid;
    const platform = req.body.platform;
    const packageid = appid+platform;
    const appVersionNumber = req.body.appVersionNumber;

    let appregistered = false;

    Register.get().then(async(q)=>{
        q.forEach(async(registerapp)=>{
            if(registerapp.data().packageid===packageid && registerapp.data().uid===uid && registerapp.data().appVersionNumber===appVersionNumber){
                appregistered=true;
            }
        })

        const deviceFingerPrint = hashfunc(packageid+appVersionNumber+uid);

        if(!appregistered){
            await Register.doc(deviceFingerPrint).set({
                "appid":appid,
                "platform":platform,
                "packageid":packageid,
                "uid":uid,
                "appVersionNumber":appVersionNumber,
                "deviceFingerPrint" :deviceFingerPrint
            })
            res.send(`deviceFingerPrint: ${deviceFingerPrint}`)
        }
        else{
            res.send(`deviceFingerPrint: ${deviceFingerPrint}`)
        }
    })
})
*/
module.exports = router;