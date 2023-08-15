import express from "express";
import cors from "cors";
import connection from "./db/connection.js"; 
import userRouter from "./routes/userRoute.js"; 
import dashboardRouter from "./routes/dashboardRoute.js"
import bookRouter from "./routes/bookRoute.js"
 
  

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(userRouter);
app.use(dashboardRouter);
app.use(bookRouter);

// app.use(cors({ origin: "https://bookshelf-8yfg.onrender.com" }));

app.get("/", async (req, res) => {
  // res.status(200).sendFile(__dirname + "main.js")
});

 

connection.then(() => {
  app.listen(8080, () => console.log("Server started at port 8080"));
});
