import express from "express";
import cors from "cors";
import connection from "./db/connection.js";
import user from "./models/user.js";
import book from "./models/book.js";
// import {jwt} from "jsonwebtoken"
import { Admin } from "mongodb";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", async (req, res) => {
  // res.status(200).sendFile(__dirname + "main.js")
});
 
app.get("/book", async(req, res) => {
  const result = await book.find({})

  if(result){
    res.status(200).json(result)
  }else {
    res.status(500).json("An error occurred while searching." );
  }

})  
 
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

 

app.post("/search", async (req, res) => {
  try {
    console.log(req.body.searchBook)
    const regEx = new RegExp(req.body.searchBook, "i");
    const result = await book.find({ title: regEx });
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching." });
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
