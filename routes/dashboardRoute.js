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
 

//---------------------------LIKED BOOKS-----------------------//
  router.patch("/liked", authentication, async (req, res) => {
    let bookId = req.body.likedBook;
    let username = req.authUsername;
  
    let filter = await dashboard.findOne({ username });
    let booksliked = filter.likedBooks;
  
    if (booksliked.includes(bookId)) {
      res.status(200).send("You already liked this book");
    } else {
      let liked = await dashboard.updateOne(
        { username },
        { $push: { likedBooks: bookId } }
      );
      res.status(200).send("succesfuly added books");
    }
   
  });


export default router;  