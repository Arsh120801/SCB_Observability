//Firebase setup
const firebase = require('firebase');
const firebaseConfig = require('./firebaseConfig');
firebase.initializeApp(firebaseConfig);

//importing required packages
const express = require('express');
const cors=require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//importing required routes
const userRoutes = require('./ApplicationRoutes/user'); 
const transactionRoutes = require('./ApplicationRoutes/transaction');
const registerappRoute = require('./observabilityRoutes/registerapp');
const initializeTrackingRoute = require('./observabilityRoutes/initializeTracking');
const apistatsRoute = require('./observabilityRoutes/apistats');
const savedataRoute = require('./observabilityRoutes/savedata');

//sessions setup
const sessionconfig={
    name:'session',
    secret:'scbmobileapp',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

//starting the app
const app=express()
app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.use(session(sessionconfig));

//User APIs
app.use('/',userRoutes);

//Transaction APIs
app.use('/',transactionRoutes);

//*********************OBSERVABILITY SECTION**********************//

//registerapp
app.use('/',registerappRoute);

//initializeTracking   
app.use('/',initializeTrackingRoute);

//apistats
app.use('/',apistatsRoute);

//User journey related data
app.use('/',savedataRoute);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes
  
    // Determine the appropriate error response based on the error
    let statusCode = 500; // Internal Server Error
    let message = "Internal Server Error";
  
    // Customize the error response based on the specific error
    if (err instanceof CustomAppError) {
      statusCode = err.statusCode;
      message = err.message;
    }
  
    // Return the error response to the client
    res.status(statusCode).json({ error: message });
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("welcome to port 3000");
})