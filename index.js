import express from "express";
import cors from "cors";
import connection from "./db/connection.js"; 
import userRouter from "./routes/userRoute.js"; 
import dashboardRouter from "./routes/dashboardRoute.js"
import bookRouter from "./routes/bookRoute.js"
import friendListRouter from "./routes/friendListRouter.js"
 
  

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
 }));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://bookshelf-8yfg.onrender.com');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

 

app.use(userRouter);
app.use(dashboardRouter);
app.use(bookRouter);
app.use(friendListRouter)

// app.use(cors({ origin: "https://bookshelf-8yfg.onrender.com" }));

app.get("/", async (req, res) => {
  // res.status(200).sendFile(__dirname + "main.js")
});

  

connection.then(() => {
  app.listen(8080, () => console.log("Server started at port 8080"));
});
