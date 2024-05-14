import express from "express";
import book from "../models/book.js";
import authentication from "../auth/authenticat.js";
import dashboard from "../models/dashboard.js";

const router = express.Router();

//-----------------------------GET ALL BOOKS-------------------------------//
router.get("/book", async (req, res) => {
  const result = await book.find({});

  if (result) { 
    res.send({status:200, message: "Paaword match", results: result})

  } else {
    res.status(500).json("An error occurred while searching.");
  }
});

 
//------------------------------LIKED BOOKS-------------------------//
router.patch("/liked/:session", authentication, async (req, res) => {
  let bookId = req.body.likedBook;
  let username = req.authUsername;

  let filter = await dashboard.findOne({ username });
  let booksliked = filter.likedBooks;

  if (booksliked.includes(bookId)) {

    let unlike = await dashboard.updateOne(
      { username },
      { $pull: { likedBooks: bookId } }
    );
 
    res.send({status: 201, message: "Remove from like  book"}) 

  } else {
    let liked = await dashboard.updateOne(
      { username },
      { $push: { likedBooks: bookId } }
    );
 
    res.send({status: 200, message: "succesfuly liked books"}) 
  }
});


//---------------------------COMMENT BOOKS-----------------------------// 
router.patch("/comment/:session", authentication, async(req, res) =>{
  let bookid = req.body.commentedBook;
  let coment = req.body.comment
  let username = req.authUsername;

  console.log(coment, bookid, username)

  let filter = await dashboard.findOne({ username });
  let commentedBooks = filter.comentedBooks;
 
  let checkingBooks = commentedBooks.filter((book) => {
    let exist = false;
    if (book.bookId === bookid) {
      exist = true;
    } else {
      exist = false;
    }
    return exist;
  });

  
  if (checkingBooks.length === 0) {
    await dashboard.updateOne(
      { username },
      { $push: { comentedBooks: { bookId: bookid, comment: coment } } }
    ); 
    res.send({status: 200, message: "succesfuly comment books"}) 

  } else { 
    res.send({status: 201, message: "You already gave comment to this book"})  
  }
})



//-------------------------------CURRENT READ---------------------------------
router.patch("/currentRead/:session", authentication, async (req, res) => {
  const bookId = req.body.currentReadBook;
  let username = req.authUsername;

  let filter = await dashboard.findOne({ username });
  let currentRead = filter.currentRead;

  console.log(bookId, currentRead);

  if (currentRead.includes(bookId)) {
 
    res.send({status: 202, message: "You already start this book to read"})  

  } else {
    let completedReadBooks = filter.completedReadBooks;

    if (completedReadBooks.includes(bookId)) {
      console.log("kr diya tha");
 
    res.send({status: 201, message: "You have already read this book"})  

    } else {
      let current = await dashboard.updateOne(
        { username },
        { $push: { currentRead: bookId } }
      );
 
    res.send({status: 200, message: "succesfuly start reading this book"})  

    }
  }
});



//-------------------------RATING-BOOKS---------------------------------//
router.patch("/rating/:session", authentication, async (req, res) => {
  let bookid = req.body.ratingBook;
  let username = req.authUsername;
  let rated = req.body.rating;

  let filter = await dashboard.findOne({ username });
  let ratingBooks = filter.ratingBooks;

  //CHECKING BOOK ALREADY HAS GIVEN RATING
  let checkingBooks = ratingBooks.filter((book) => {
    let exist = false;
    if (book.bookId === bookid) {
      exist = true;
    } else {
      exist = false;
    }
    return exist;
  });


  if (checkingBooks.length === 0) {
    await dashboard.updateOne(
      { username },
      { $push: { ratingBooks: { bookId: bookid, rating: rated } } }
    );
 
    res.send({status:200, message: "succesfuly rated books"})

  } else {
 
    res.send({status: 200, message: "You already gave rating to this book"}) 
  }
});


//-----------------------------------COMPLETED BOOK--------------------------//
router.patch("/completed/:session", authentication, async (req, res) => {
  let bookid = req.body.completedBook;
  let username = req.authUsername;

  let filter = await dashboard.findOne({ username });
  let completedReadBooks = filter.completedReadBooks;

  if (completedReadBooks.includes(bookid)) {

    console.log("kr diya tha"); 
    res.send({status: 201, message: "You have already complete this book"}) 

  } else {
    //delete current read from mongodb database
    let deleteCurrentRead = await dashboard.updateOne(
      { username },
      { $pull: { currentRead: bookid } }
    );

    //adding to complete book
    await dashboard.updateOne(
      { username },
      { $push: { completedReadBooks: bookid } }
    );
 
    console.log("successfull");
    res.send({status: 200, message: "succesfuly completed read books"}) 

  }
});

//------------------------------------SEARCH-BOOKS-----------------------------//
router.post("/search", async (req, res) => {
  try {
    console.log(req.body.searchBook);
    const regEx = new RegExp(req.body.searchBook, "i");
    const results = await book.find({ title: regEx });
    
    res.send({status: 200, message: "Got all books searched books.", results:results}) 
  } catch (error) {
    res.send({status: 500, message: "Book not found!"})
  }
});


//------------------------------------SEARCH-BOOKS BY TYPE------------------------//
router.post("/searchBookByType", async(req, res)=>{ 

  try{
    const bookType = req.body.bookType 
    const results = await book.find({bookType})  
    res.send({status: 200, message: "Got all books searched by type.", results:results}) 
  }catch{
    res.send({status: 500, message: "Book not found!"})
  }
  
}) 


export default router;
