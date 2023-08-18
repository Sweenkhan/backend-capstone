import express from "express";
import dashboard from "../models/dashboard.js";
import user from "../models/user.js";
import authentication from "../auth/authenticat.js";
import book from "../models/book.js";

const router = express.Router()
  
 
//-------------------------------dashboard-------------------// 
router.get("/dashboard", authentication, async (req, res) => {
    let username = req.authUsername;
    const userdata = await dashboard.findOne({ username });
    // console.log(userdata)
    res.status(200).send(userdata);
  });
 

router.get("/getAllLikedBooks", authentication, async(req, res) =>{

  let username = req.authUsername;
  const filterUser = await dashboard.findOne({username})
  let likedBooksIds = filterUser.likedBooks.slice(1)
  
    
  const collectData = await Promise.all(likedBooksIds.map(async (_id) => {
    return await book.findOne({ _id });
  }));
 
  console.log(username, likedBooksIds)
  
  res.status(200).send(collectData)

}) 


export default router;  