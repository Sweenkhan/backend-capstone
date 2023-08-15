import { Router } from "express";
import dashboard from "../models/dashboard.js";
import user from "../models/user.js";
import authentication from "../auth/authenticat.js";

 const router = Router()
  
//-------------------------------dashboard-------------------// 
router.post("/dashboard", authentication, async (req, res) => {
    let username = req.authUsername;
    const userdata = await dashboard.findOne({ username });
    // console.log(userdata)
    res.status(200).send("success auth");
  });
 

//  ---------------checkh------------------ 
router.get("/check", authentication, async (req, res) => {
    let username = req.authUsername;
    const userdata = await user.findOne({ username });
    console.log(userdata);
  
    res.status(200).send("success auth");
  });
  

//  ---------------checkheader------------------
router.get("/checkHeader", (req, res) => {
    console.log(req.headers.authorization);
    res.status(200).send("success auth");
  });


export default router;  