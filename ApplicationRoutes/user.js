const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../dbCollections/user');
const Device=require('../dbCollections/device');
const checkheader = require('../middlewares/checkheader');
//current date and time
const currentDateandTime=()=>{
    const dateObj = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };              
    return formattedDateTime = dateObj.toLocaleString('en-IN', options).replace(',', '') + '.' + ('000' + dateObj.getMilliseconds()).slice(-3);
}


//signup api
router.post('/signup',checkheader,async(req,res)=>{
    const email = req.body.email;
    const name = req.body.name;
    const pass = req.body.password;
    const deviceFingerPrint = req.body.deviceFingerPrint;
    const userid = uuidv4();

    if(deviceFingerPrint === null){
        res.send("device not found!");
        return;
    }

    await User.doc(email).set({
        "email": email,
        "name": name,
        "password":pass,
        "userid":userid
    });
    
    Device.doc(deviceFingerPrint).collection('userids').doc().set({
        "email":email,
        "userid":userid,
        "loginTime":currentDateandTime()
    })
    req.session.user={email,id:'scb'}
    res.send(email);
})

//login api
router.post('/login',checkheader,async(req,res)=>{
    
    const email = req.body.email;
    const pass = req.body.password;
    const deviceFingerPrint = req.body.deviceFingerPrint;

    if(deviceFingerPrint === null){
        res.send("device not found!");
        return;
    }

    let comparepsd = false;
    User.get().then(async(q)=>{
        q.forEach(async(user)=>{
           if(user.id===email && user.data().password === pass){
                comparepsd=true;
           }
        })
        if(!comparepsd){
            res.send("wrong id/password")
        }
        else{
            let userid="";
            await User.doc(email).get().then((user)=>{
                userid = user.data().userid;
            });            

            Device.doc(deviceFingerPrint).collection('userids').doc().set({
                "email":email,
                "userid":userid,
                "loginTime":currentDateandTime()
            })
            req.session.user={email,id:'scb'}
            res.send(`logged in ${userid} !`);
        }
    })
})

//logout api
router.get('/logout',(req,res)=>{
    const user= req.session.user;
    console.log(`${user.email}logged out!`)
    req.session.user=null;
    res.send("logged out!!")
})

module.exports = router;