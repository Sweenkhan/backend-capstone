import express from "express";
import cors from "cors";
import connection from "./db/connection.js";
import user from "./models/user.js";
import book from "./models/book.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import dashboard from "./models/dashboard.js";
import authentication from "./auth/authenticat.js";
import userRouter from "./routes/userRoute.js"; 
import dashboardRouter from "./routes/dashboardRoute.js"
 
 
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/book", userRouter);
app.use("/book", dashboardRouter);

// app.use(cors({ origin: "https://bookshelf-8yfg.onrender.com" }));

app.get("/", async (req, res) => {
  // res.status(200).sendFile(__dirname + "main.js")
});


//------------------------------all books-----------------------//
// app.get("/book", async (req, res) => {
//   const result = await book.find({});

//   if (result) {
//     res.status(200).json(result);
//   } else {
//     res.status(500).json("An error occurred while searching.");
//   }
// });


//-------------------------------------login user------------------------//
 


//----------------------------search book---------------------------//
app.post("/search", async (req, res) => {
  try {
    console.log(req.body.searchBook);
    const regEx = new RegExp(req.body.searchBook, "i");
    const result = await book.find({ title: regEx });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching." });
  }
});


 

app.patch("/liked", authentication, async (req, res) => {
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

  //  console.log(booksliked.includes(bookId));
});

app.get("/logout", (req, res) => {
  console.log(req.cookies);
  res.cookie("token", "", { maxAge: 1 });
  res.redirect("/");
});

connection.then(() => {
  app.listen(8080, () => console.log("Server started at port 8080"));
});
