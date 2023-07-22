import express from "express";
import cors from "cors";
import connection from "./db/connection.js";
import user from "./models/user.js";
import book from "./models/book.js";
import { Admin } from "mongodb";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", async (req, res) => {
  // res.status(200).sendFile(__dirname + "main.js")
});

app.post("/book", async (req, res) => {
  const { books } = req.body;

  if(books){
    for (let bookdata of books) {
        if (
          bookdata.volumeInfo.title ||
          bookdata.volumeInfo?.authors[0] ||
          bookdata.volumeInfo.imageLinks?.thumbnail ||
          bookdata.saleInfo.saleInfo
        ) {
          let title =
            bookdata.volumeInfo.title.length > 25
              ? bookdata.volumeInfo.title.slice(0, 25)
              : bookdata.volumeInfo.title;
          let author =
            bookdata.volumeInfo.authors[0].length > 20
              ? bookdata.volumeInfo.authors[0].slice(0, 20)
              : bookdata.volumeInfo.authors[0];
          let image = bookdata.volumeInfo.imageLinks?.thumbnail
            ? bookdata.volumeInfo.imageLinks.thumbnail
            : books[6].volumeInfo.imageLinks.thumbnail;
          let description =  ( bookdata.volumeInfo.description.length > 300)
          ?  bookdata.volumeInfo.description.slice(0, 300) : bookdata.volumeInfo.description;
          let bookType = "poetry";
          let country = bookdata.saleInfo.country;
    
          // const newBooks = new book({
          //   title,
          //   author,
          //   image,
          //   description,
          //   bookType,
          //   country
          // });
    
          // await newBooks.save();  
          // console.log("ho gya"); 
        }  
      }
      res.status(200).send("books available");
  } else {
    res.status(350).send("please solve this error");
  } 
 
});



app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userTryingToLogin = await user.findOne({ username });

  if (user) {
    if (password === userTryingToLogin.password) {
      console.log("ho rha hai user check to");
      res.status(200).send("success");
    } else {
      res.status(401).send("invalid credential");
    }
  } else {
    res.status(401).send("invalid credential");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, phone, username, password } = req.body;
  const newUser = new user({
    name,
    email,
    phone,
    username,
    password,
  });

  await newUser.save();
  res.status(200).end("Well Done");
});

connection.then(() => {
  app.listen(8080, () => console.log("Server started at port 8080"));
});
