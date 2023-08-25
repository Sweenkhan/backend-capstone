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
          const token = jwt.sign({ userName: username }, process.env.JWT_SECRET, {expiresIn: "5m"});
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



//-----------------------------REGISTER-USER--------------------------//

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
          username: savedUser.name,
          likedBooks: 0,
          ratingBooks: 0,
          commentBooks: 0,
          completedReadBooks: 0,
          comentedBooks: 0,
          currentRead: 0,
        });
        await newDashboard.save();

        const newList = new friendlist({
          username: savedUser.name, 
          sendRequest: 0,
          pendingRequest: 0,
          friendList: 0
        })
    
         await newList.save(); 
      }
  
      
      // res.status(200).send("success register");
      res.send({status:200, message: "successfully regsiter"})

    } catch (err) {
      res.send({status:201, message: "failed regsiteration"})

      console.log(err); 
    }
  });
  



//--------------------------GET ALL USERS---------------------------//

router.get("/allusers",authentication,  async(req, res) =>{
 
    const getAllUsers = await user.find({}); 
     res.status(200).send(getAllUsers);
})

 
//--------------------------GET ORIGINAL USER-----------------------//
router.get("/originalUser",authentication, async(req, res) =>{
  
  const username = req.authUsername;
  const userData = await user.findOne({username})

  console.log(userData)
  res.status(200).send(userData)
})
 









export default  router;
