const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../dbCollections/user');
const Transaction = require('../dbCollections/transaction');
const requirelogin = require('../middlewares/requirelogin');


//creating the transaction api
router.post('/transaction',requirelogin,async(req,res)=>{
    const amount = req.body.amount;
    const paynm = req.body.payeeName;
    const email = req.session.user.email;
    let userid="";
    await User.doc(email).get().then((user)=>{
        userid = user.data().userid;
    });
    const status = "Pending";
    const transactionid = uuidv4();

   await Transaction.doc(transactionid).set({
        "amount":amount,
        "payeeName":paynm,
        "userid":userid,
        "status":status,
        "transactionid" : transactionid
    });

    res.send("done");

})

//fetching the transactionlist
router.get('/transactionlist',requirelogin,async(req,res)=>{
    var transactions = [];
    var fields = {};
    Transaction.get().then(async(q)=>{
        q.forEach(async(transaction)=>{
            fields={
                "amount":transaction.data().amount,
                "payeeName":transaction.data().payeeName,
                "id":transaction.data().transactionid
            }
            transactions.push(fields)
        })
        res.json(transactions);
    })
})

//details of perticular transaction
router.get('/transactionlist/:id',requirelogin,async(req,res)=>{
    const {id} =req.params;
    const transaction = Transaction.doc(id)
    const snapshot = await transaction.get();
    res.send(snapshot.data());
})

//approving transaction
router.post('/transactionlist/:id/approve',requirelogin,async(req,res)=>{
    const {id} =req.params;
    const transaction = Transaction.doc(id);
    await transaction.update({ status: 'Approved' });
    const snapshot = await transaction.get();
    res.send(snapshot.data());
})

//rejecting transaction
router.post('/transactionlist/:id/reject',requirelogin,async(req,res)=>{
    const {id} =req.params;
    const transaction = Transaction.doc(id);
    await transaction.update({ status: 'Rejected' });
    const snapshot = await transaction.get();
    res.send(snapshot.data());
})

module.exports = router;
