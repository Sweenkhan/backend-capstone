import friendlist from "../models/friendlist.js";
import authentication from "../auth/authenticat.js";
import express  from "express";


const router = express.Router()


//------------------------SEND REQUEST---------------------------// 
router.patch("/friendRequest", authentication, async(req, res) =>{
    
    const friendUsername = req.body.friendUsername;
    const username = req.authUsername;
  
    const findUser = await  friendlist.findOne({username: friendUsername});
    const pendingList = findUser.pendingRequest;
  
    if(pendingList.includes(friendUsername)){ 
 
      res.status(201).send("already you sen't request");

      }else{
        const gotRequest = await friendlist.updateOne(
          {username: friendUsername},
          {$push: {pendingRequest : username}}
          )

          
          res.status(200).send("everyThing is good");
          console.log(gotRequest);
      }
  
  })
  
  
  //---------------------------------GET ALL PENDING REQUEST------------------------------//
  router.get("/pendingRequests", authentication , async(req, res) =>{
    
    const username = req.authUsername;
    const filter  = await friendlist.findOne({username})
  
    const allPendingRequest = filter.pendingRequest; 
    res.status(200).send(allPendingRequest);
  
  })

  

  export default router