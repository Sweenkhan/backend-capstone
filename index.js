import express from "express";
import cors from "cors";
import connection from "./db/connection.js";
import user from "./models/user.js";
import book from "./models/book.js";
import jwt from "jsonwebtoken"
import { config } from "dotenv";
import bcrypt from "bcrypt"
// import { Admin } from "mongodb";

config()

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

  try {
    const userTryingToLogin = await user.findOne({ username });

    if (userTryingToLogin) {
      const match = await bcrypt.compare(password, userTryingToLogin.password);

      if (match) {
        console.log("Password match");
        res.status(200).send("success");
      } else {
        console.log("Password doesn't match!");
        res.status(402).send("Invalid credentials");
      }
    } else {
      console.log("User not found!");
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error");
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
  const hashedpassword = await bcrypt.hash(password, 10);
  
  const newUser = new user({
    name,
    email,
    phone,
    username,
    password: hashedpassword,
  });

  try{
  const savedUser =  await newUser.save();
  const token = jwt.sign({ userId: savedUser._id}, process.env.JWT_SECRET);

  const savedToken = ("token", token);

  res.status(200).send(savedToken);
  } catch(err){
    console.log(err);
    res.redirect("/register")
  }
   
});


app.get("/dashboard", (req, res) =>{
      
  const token = req.cookies.token;
  if(!token){
    res.redirect('/login')
  }

  try{
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodeToken.userId;

    if(userId){ 
      res.render("/dashboard")
    } 
    res.redirect("/login")
  } catch(err){
    console.log(err);
    res.redirect("/login")
  } 

})


app.get("/logout", (req, res) =>{
  console.log(req.cookies)
  res.cookie("token", "", {maxAge: 1}); 
  res.redirect("/")
})



connection.then(() => {
  app.listen(8080, () => console.log("Server started at port 8080"));
});
