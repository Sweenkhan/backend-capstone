import user from "../models/user.js";
import dashboard from "../models/dashboard.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { Router } from "express";
import friendlist from "../models/friendlist.js";
import authentication from "../auth/authenticat.js";

config()
const router =  Router() 
//-----------------------LOGIN----------------------//
router.post("/login", async(req, res) => { 

    const { username, password } = req.body;
  
    try {
      const userTryingToLogin = await user.findOne({ username });
  
      if (userTryingToLogin) {
        const match = await bcrypt.compare(password, userTryingToLogin.password);
  
        if (match) {
          const token = jwt.sign({ userName: username }, process.env.JWT_SECRET, {expiresIn: "1d"});
          const savedToken = ("token", token);
  
          console.log("Password match"); 
          res.send({status:200, message: "Paaword match", savedToken: savedToken})
        } else {
          console.log("Password doesn't match!"); 
          res.send({status:402, message: "Password doesm't match!"})

        }
      } else {
        console.log("User not found!");
        res.send({status:401, message: "User not found!"})
      }
    } catch (err) { 
      res.send({status:500, message: "invalid credantial"})
    }
  }); 



//-----------------------------REGISTER-USER-------------------------------------//

  router.post("/register", async (req, res) => {
    const { name, email, phone, username, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
  
    const newUser = new user({
      name,
      email,
      phone,
      username,
      password: hashedpassword,
    });
  
    try {
      const savedUser = await newUser.save();
  
      if (savedUser) {
        const newDashboard = new dashboard({
          username: savedUser.username,
          likedBooks: 0,
          ratingBooks: 0,
          commentBooks: 0,
          completedReadBooks: 0,
          comentedBooks: 0,
          currentRead: 0,
        });
        await newDashboard.save();

        const newList = new friendlist({
          username: savedUser.username, 
          sendRequest: 0,
          pendingRequest: 0,
          friendList: 0
        })
    
         await newList.save(); 
      }
  
       
      res.send({status:200, message: "successfully regsiter"})

    } catch (err) {
      res.send({status:201, message: "failed regsiteration"})

      console.log(err); 
    }
  });
  



//--------------------------GET ALL USERS---------------------------///
router.get("/allusers/:session", authentication,  async(req, res) =>{
 
    const getAllUsers = await user.find({}); 
    //  res.status(200).send(getAllUsers);
  res.send({status:200, message: "orignalUser data", getAllUsers: getAllUsers})

})

 
//--------------------------GET ORIGINAL USER-----------------------//
router.get("/originalUser/:session" ,authentication, async(req, res) =>{
  
  const username = req.authUsername;
  const userdata = await user.findOne({username})

  // const userData = {...userdata.toObject(), originalPassword :  updatePassword}
  // console.log(userData)
  // console.log(updatePassword) 
  res.send({status:200, message: "orignalUser data", userData: userdata})
})
 


//-------------------------UPDATE USER PROFILE----------------------//
router.put("/editUserProfile/:session", authentication, async(req, res) => {

  try{

    let username = req.authUsername;
    
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let simplePassword = req.body.password;
    
    let password = await bcrypt.hash(simplePassword, 10)
    
    
    
    let updatedUser = await user.updateOne({username}, {$set : {username, name, email, phone, password}})
    
    if (updatedUser.modifiedCount === 1) {
      res.status(200).json({ message: "User profile updated" });
    } else {
      res.status(404).json({ message: "User not found" });
    } 
  }

  catch {

    res.send({status:401, message: "user not fount"})
  }


})



//-------------------------------CHECKING OLD PASSWORD------------------------

router.post("/checkOldPassword/:session", authentication, async(req, res)=> {
 
  const username = req.authUsername;
  const password = req.body.password; 

    const userTryingChangePassword = await user.findOne({username})
 
    if(userTryingChangePassword){
      const match = await bcrypt.compare(password, userTryingChangePassword.password)
      console.log(match)
      if(match) {
        res.send({status:200, message: "password match", password})
      } else {
        res.send({status:201, message: "Wrong password"})

      }
    }  else {
      res.send({status:202, message: "Wrong password"})
    }
 
})

 


export default  router;
