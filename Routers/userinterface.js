const express=require("express");
const connectionrequestModel=require("../schema/connection")
const Subscriber=require("../schema/userschema")


const userAuth = require("../middlewares/cookie");
const userRouter=express.Router();


userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggeduser=req.user   
        const connectionrequests=await connectionrequestModel.find({
            touserid:loggeduser._id,
            status:"interested"
        }).populate("fromuserid",["Name","Email","photoUrl","Age","Gender","About"])

        res.json({
            message:"data fetched",data:connectionrequests
        })
    }catch(err)
    {
        res.send("email not found"+err.message)
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
      const loggeduser = req.user;
      const connections = await connectionrequestModel.find({
        $or: [
          { touserid: loggeduser._id, status: "accepted" },
          { fromuserid: loggeduser._id, status: "accepted" }
        ]
      }).populate("touserid", ["Name", "photoUrl", "About","Email","Age","Gender"])
      .populate("fromuserid", ["Name", "photoUrl", "About", "Email", "Age", "Gender"])
      
      res.status(200).json({
        success: true,
        message: "Connections fetched successfully",
        data: connections
      });
    } catch (err) {
      console.error("Error fetching connections:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch connections",
        error: err.message
      });
    }
  });

// userRouter.get("/feed",userAuth,async(req,res)=>{
//     try{
//         const loggeduser=req.user;
//         const page=parseInt(req.query.page)||1;
//         let limit=parseInt(req.query.limit)||10;
//         limit=limit>50?50:limit;
//         const skip=(page-1)*limit;


//     const connectionreq=await connectionrequestModel.find({
//         $or:[
//        { touserid:loggeduser._id},
//         {fromuserid:loggeduser._id}
//     ]
//     }).populate("fromuserid",["Name"])
//     const hidinguser=new Set();
//     connectionreq.forEach((req)=>{
//         hidinguser.add(req.fromuserid.toString());
//         hidinguser.add(req.touserid.toString());
//     })

    
//     const users=await Subscriber.find({
//         $and:[{_id:{$nin:Array.from(hidinguser)},
//         _id:{$ne:loggeduser._id}}]
//     })
 
//     // console.log(users);
    
//     res.json(users)
// }catch(err){
//     res.send("email not found"+err.message)
// }
// })
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggeduser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    
    // Find all connection requests involving the logged-in user
    const connectionReqs = await connectionrequestModel.find({
      $or: [
        { touserid: loggeduser._id },
        { fromuserid: loggeduser._id }
      ]
    });
    
    // Create a set of user IDs to exclude
    const hidingUserIds = new Set();
    
    // Add all users involved in connections to the exclusion set
    connectionReqs.forEach((req) => {
      hidingUserIds.add(req.fromuserid.toString());
      hidingUserIds.add(req.touserid.toString());
    });
    
    // Make sure to add the logged user ID to excluded list
    hidingUserIds.add(loggeduser._id.toString());
    
    // Find users who are not in the exclusion set
    const users = await Subscriber.find({
      _id: { $nin: Array.from(hidingUserIds) }
    })
    .skip(skip)
    .limit(limit);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "An error occurred: " + err.message });
  }
});


module.exports=userRouter