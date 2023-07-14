const express = require('express');
const router = express.Router();
const hashfunc = require('./functions/hashfunction');
const Register = require('../dbCollections/register');

//Register App

//Register is the data collection in firestore

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

module.exports = router;