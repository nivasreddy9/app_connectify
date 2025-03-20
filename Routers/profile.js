const express=require("express")
const mongoose=require("mongoose")
const profile=express.Router()
const storage=require("../Database/mongo")
const Subscriber=require("../schema/userschema")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const cookieParser = require("cookie-parser");
profile.use(cookieParser()); 
profile.use(express.json());
const userAuth=require("../middlewares/cookie")


profile.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user)
    }catch{
        res.status(400).send("error")
    }


})

profile.get("/gettingdata",userAuth,async(req,res)=>{
    // const getemail=req.body.Email

try{
    const data=await Subscriber.find({})
    if (data.length > 0) {  // Check if the result is not an empty array
        res.send(data);  // Send the found data
    } else {
        res.status(404).send("Email not found");  // If no match is found, return 404
    }
}catch(err){
    res.send("email not found"+err.message)
}
})


profile.post("/profile/edit", userAuth, async (req, res) => {
    const { id, ...data } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    console.log("Received ID:", id);
    console.log("Update Data:", data);

    try {
        const updated = await Subscriber.findByIdAndUpdate(id, data, { new: true });

        if (!updated) {
            return res.status(404).json({ error: "User not found. Check if ID is correct." });
        }

        // Return data in the structure expected by frontend
        res.json({ data: updated });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Server error. Update failed." });
    }
});



// profile.patch("/profile/edit/", userAuth, async (req, res) => {
//     const { id, ...data } = req.body;
    
//     if (!id) {
//         return res.status(400).send("ID is required");
//     }

//     console.log("Received ID:", id);
//     console.log("Update Data:", data);

//     try {
//         const updated = await Subscriber.findByIdAndUpdate(id, data, { new: true });

//         if (!updated) {
//             return res.status(404).send("User not found. Check if ID is correct.");
//         }

//         res.send(updated);
//     } catch (err) {
//         console.error("Update error:", err);
//         res.status(500).send("Server error. Update failed.");
//     }
// });


// profile.patch("/profile/edit", userAuth, async (req, res) => {
//     const { id, ...data } = req.body; // Destructure to separate ID and update data
//     try {
//         const updated = await Subscriber.findByIdAndUpdate(id, data, { new: true });
//         if (!updated) {
//             return res.status(404).send("User not found");
//         }
//         res.send(updated);
//     } catch (err) {
//         console.error("Update error:", err);
//         res.status(400).send("Update failed");
//     }
// });


// profile.patch("/profile/edit",userAuth,async(req,res)=>{
//     const id=req.body.id
//     const data=req.body
//     try{
//         updated=await Subscriber.findByIdAndUpdate({_id:id},data)
//         res.send(updated)
//     }catch{
//         res.status(400).send("update failed")
//     }
// })

// profile.patch("/profile/edit", userAuth, async (req, res) => {
//     const { id, password, ...data } = req.body; 

//     try {
//         if (password) {
//             // Hash the new password before saving
            
//             data.password = await bcrypt.hash(password, 10);
//         }

//         const updated = await Subscriber.findByIdAndUpdate(id, data, { new: true, runValidators: true });

//         if (!updated) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ message: "Profile updated successfully", updated });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Update failed", error: error.message });
//     }
// });


module.exports=profile