import express from "express";
import book from "../models/book.js";
import authentication from "../auth/authenticat.js";
import dashboard from "../models/dashboard.js";

const router = express.Router();

//----------------------GET ALL BOOKS-----------------//
router.get("/book", async (req, res) => {
  const result = await book.find({});

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json("An error occurred while searching.");
  }
});

//------------------SEARCH-BOOKS------------------//
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

//---------------RATING-BOOKS------------------//

router.patch("/rating", authentication, async (req, res) => {
  let bookid = req.body.ratingBook;
  let username = req.authUsername;
  let rated = req.body.rating;

  let filter = await dashboard.findOne({ username });
  let ratingBooks = filter.ratingBooks;

  //CHECKING BOOK ALREADY HAS GIVEN RATING
  function ratedBooks() {
    let exist = false;
    for (let i = 0; i < ratingBooks.length; i++) {
      if (ratingBooks[i].bookId === bookid) {
        exist = true;
      } else {
        exist = false;
      }
    }

    return exist;
  }

  let ratingExist = ratedBooks();
  console.log(bookid, rated, ratingExist);

  if (!ratingExist) {
    await dashboard.updateOne(
      { username },
      { $push: { ratingBooks: { bookId: bookid, rating: rated } } }
    );
    res.status(200).send("succesfuly rated books");
  } else {
    res.status(200).send("You already gave rating to this book");
  }
});

//-----------------------------------COMPLETED BOOK-----------------------

router.patch("/completed", authentication, async (req, res) => {
  let bookid = req.body.completedBook;
  let username = req.authUsername;

  let filter = await dashboard.findOne({ username });
  let completedReadBooks = filter.completedReadBooks;

  if (completedReadBooks.includes(bookid)) {
    console.log("kr diya tha")
    res.status(200).send("You already gave rating to this book");
  } else {
    console.log("kr diya")
    await dashboard.updateOne(
      { username },
      { $push: { completedReadBooks: bookid } }
    );
    res.status(200).send("succesfuly completed read books");
  }
});

export default router;
