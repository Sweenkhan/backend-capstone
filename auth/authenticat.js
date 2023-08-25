import jwt from "jsonwebtoken";
import { config } from "dotenv";


config(); 

function authentication(req, res, next) {
  const session = req.body.session || req.headers.authorization;

  if (!session) {
    // res.status(401).send("failed auther");
    res.send({status:400, message: "Didn't get any SessionId"}) 
  }

  try {
    console.log("reached here");
    const decodeToken = jwt.verify(session, process.env.JWT_SECRET);
    const userName = decodeToken.userName;

    if (userName) {
      req.authUsername = userName;
      next();
    } else {
      // res.status(300).send("failed auther");
      res.send({status:300, message: "failed authentication"}) 
    }
  } catch (err) {
    console.log(err);
    // res.status(301).send("failed auther");
    res.send({status:301, message: "Unknown User"}) 
  }
}

export default authentication;
