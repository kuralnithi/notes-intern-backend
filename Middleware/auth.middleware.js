const { set } = require("mongoose");

jwt = require("jsonwebtoken");
dotenv = require("dotenv");
dotenv.config();

module.exports.authMiddleware = async (req, res, next) => {
  try {
    console.log("inside auth middleware");
    const token = req.headers.authorization;

    console.log("token got in bE", token);

    if (!token) {
      console.log("token missing in bE", token);

      return res.status(200).json({ message: "token missing" });
    }

    const decode = jwt.verify(token, process.env.SECTERT_KEY);

    req.user = decode;
    // console.log(req.user);

    next();
  } catch (error) {
    console.log(error);

    return res.status(200).json({ message: "token invalid" });
  }
};
