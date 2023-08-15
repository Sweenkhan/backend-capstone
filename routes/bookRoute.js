import  express  from "express";
import book from "../models/book.js";

const router = express.Router()


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

export default router