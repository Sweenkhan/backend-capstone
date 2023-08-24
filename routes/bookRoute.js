import express from "express";
import book from "../models/book.js";
import authentication from "../auth/authenticat.js";
import dashboard from "../models/dashboard.js";

const router = express.Router();

//-----------------------------GET ALL BOOKS-------------------------------//
router.get("/book", async (req, res) => {
  const result = await book.find({});

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json("An error occurred while searching.");
  }
});

//------------------------------------SEARCH-BOOKS-----------------------------//
router.post("/search", async (req, res) => {
  try {
    console.log(req.body.searchBook);
    const regEx = new RegExp(req.body.searchBook, "i");
    const result = await book.find({ title: regEx });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching." });
  }
});

//-------------------------RATING-BOOKS---------------------------------//
router.patch("/rating", authentication, async (req, res) => {
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
    res.status(200).send("succesfuly rated books");
  } else {
    res.status(200).send("You already gave rating to this book");
  }
});

//-----------------------------------COMPLETED BOOK--------------------------//
router.patch("/completed", authentication, async (req, res) => {
  let bookid = req.body.completedBook;
  let username = req.authUsername;

  let filter = await dashboard.findOne({ username });
  let completedReadBooks = filter.completedReadBooks;

  if (completedReadBooks.includes(bookid)) {
    console.log("kr diya tha");
    res.status(200).send("You already gave rating to this book");
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

    console.log("kr diya");
    res.status(200).send("succesfuly completed read books");
  }
});

//------------------------------LIKED BOOKS-------------------------//
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


//---------------------------COMMENT BOOKS-----------------------------// 
router.patch("/comment", authentication, async(req, res) =>{
  let bookid = req.body.commentedBook;
  let coment = req.body.comment
  let username = req.authUsername;

  console.log(coment, bookid, username)

  let filter = await dashboard.findOne({ username });
  let commentedBooks = filter.comentedBooks;

  //CHECKING BOOK ALREADY HAS GIVEN RATING
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
    res.status(200).send("succesfuly comment books");
  } else {
    res.status(200).send("You already gave comment to this book");
  }
})



//-------------------------------CURRENT READ---------------------------------
router.patch("/currentRead", authentication, async (req, res) => {
  const bookId = req.body.currentReadBook;
  let username = req.authUsername;

  let filter = await dashboard.findOne({ username });
  let currentRead = filter.currentRead;

  console.log(bookId, currentRead);

  if (currentRead.includes(bookId)) {
    res.status(200).send("You already started book");
  } else {
    let completedReadBooks = filter.completedReadBooks;

    if (completedReadBooks.includes(bookId)) {
      console.log("kr diya tha");
      res.status(200).send("You have already this book");
    } else {
      let current = await dashboard.updateOne(
        { username },
        { $push: { currentRead: bookId } }
      );
      res.status(200).send("succesfuly start reading this book");
    }
  }
});

export default router;
