import express from "express";
import cors from "cors";
import connection from "./db/connection.js"; 
import userRouter from "./routes/userRoute.js"; 
import dashboardRouter from "./routes/dashboardRoute.js"
import bookRouter from "./routes/bookRoute.js"
import friendListRouter from "./routes/friendListRouter.js"
import { config } from "dotenv";
 
 config() 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors({ origin: "http://localhost:3000" })); 

app.use(cors({
  "origin": "https://bookshelf-8yfg.onrender.com",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
 })); 


app.use(userRouter);
app.use(dashboardRouter);
app.use(bookRouter);
app.use(friendListRouter) 

app.get("/", async (req, res) => {
  // res.status(200).sendFile(__dirname + "main.js")
});

connection.then(() => {
  app.listen(process.env.PORT, () => console.log("Server started at port 8080"));
});
