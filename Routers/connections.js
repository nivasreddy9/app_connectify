const mongoose = require("mongoose");
const express=require("express")
const requestrouter=express.Router();
const userAuth=require("../middlewares/cookie")
const Subscriber=require("../schema/userschema")
const connectionrequestModel=require("../schema/connection")


requestrouter.post("/request/send/:status/:touserid", userAuth,async(req,res)=>{
   try{
    const fromuserid=req.user._id
    const touserid=req.params.touserid;
    const status=req.params.status;
    

    const allowedstatus=["ignored","interested"]
    if(!allowedstatus.includes(status)){
        return res.status(400).json({"message":"Invalid status"})
    }


    const existingconnectionrequest=await connectionrequestModel.findOne({
        $or:[
            {fromuserid,touserid},
            {fromuserid:touserid,touserid:fromuserid}
        ]
    })
    if(existingconnectionrequest){
        return res.status(400).json({"message":"Connection request already sent"})
    }

    const touser=await Subscriber.findById(touserid)
   

    if(!touser){
        return res.status(400).json({"message":"User not found"})
    }

    const connected=new connectionrequestModel({
        fromuserid,touserid,status
    })



    const data=await connected.save()
    res.json({
        message: status+"request sent successfully",
        data
    })


   }catch(err){
    res.status(400).send("error"+err.message)

   }
})


requestrouter.post("/request/review/:status/:requestid",userAuth,async(req,res)=>{
    try{
        const loggeduser=req.user;
        const { status, requestid } = req.params;
    const requestObjectId = new mongoose.Types.ObjectId(requestid);  // Convert to ObjectId

        

        const allowedstatus=["rejected","accepted"];
        
        if(!allowedstatus.includes(status)){
            return res.status(400).json({message:"Invalid status"})
        }

        
        console.log("Logged User ID:", loggeduser._id);
        console.log("Request ID:", requestid);
        console.log("Converted Request ID (ObjectId):", requestObjectId);
        

    const connectionrequest=await connectionrequestModel.findOne({
        _id: requestObjectId,
        touserid:loggeduser._id,
        status:"interested",


        
    });


//  const connectionrequest = await connectionrequestModel.findOne({
//     _id: new mongoose.Types.ObjectId(requestid),  // Convert requestid to ObjectId
//     touserid: loggeduser._id,  // Convert loggedUser._id to ObjectId
//     status: "interested",
    
// });



    if(!connectionrequest){
        return res.status(404).json({message:"connection request not found"})
    }



    connectionrequest.status=status
    const data=await connectionrequest.save()

    res.json({message:"connectionrequest "+status})


    }catch(err){
        res.status(400).send("error"+err.message)
    }
})




module.exports=requestrouter