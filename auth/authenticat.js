import jwt from "jsonwebtoken";
import { config } from "dotenv";

config()


function authentication (req, res, next){

    const session = req.body.session;

  if (!session) {
    res.status(401).send("failed auther");
  }

  try {
    const decodeToken = jwt.verify(session, process.env.JWT_SECRET);
    const userName = decodeToken.userName;

    if (userName) {
 
        req.authUsername = userName;
        next() 
    } else {
      res.status(300).send("failed auther");
    }
  } catch (err) {
    console.log(err);
    res.status(300).send("failed auther");
  }
}

export default authentication;