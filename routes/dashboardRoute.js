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
 

 //-----------------------------ALL LIKED BOOKS------------------------// 
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


//------------------------------------GET ALL CURRENT READ BOOKS------------------------ 

router.get("/getAllReadBooks", authentication, async(req, res) =>{
     
  let username = req.authUsername;
  const filterUser = await dashboard.findOne({username})
  let currentReadIds = filterUser.currentRead.slice(1);

  const collectData = await Promise.all(currentReadIds.map(async(_id) =>{
    return await book.findOne({ _id });
  }))
 
  res.status(200).send(collectData)
});


//-----------------------------GET ALL COMPLETED READ BOOKS---------------------------- 
router.get("/getAllCompletedBooks", authentication, async(req, res) =>{

  let username = req.authUsername;
  const filterUser = await dashboard.findOne({username}); 
  let completedBookIds = filterUser.completedReadBooks.slice(1)

  const collectData = await Promise.all(completedBookIds.map(async(_id) =>{
    return await book.findOne({ _id });
  }))
  res.status(200).send(collectData);
})


//---------------------------------GET ALL RATED BOOKS-------------------------------
router.get('/getAllRatedBooks', authentication, async(req, res) =>{
  let username = req.authUsername;
  const filterUser = await dashboard.findOne({username}); 
  let ratingBookIds = filterUser.ratingBooks.slice(1)
 
  let temp =  ratingBookIds.map((books) =>{
              return books.bookId
    }) 
    
  const collectData = await Promise.all(temp.map(async(_id) =>{ 
    return await book.findOne({_id});
  }))
   
  res.status(200).send(collectData)
})


export default router;  