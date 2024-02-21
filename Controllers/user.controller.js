const userModel = require("../Models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

exports.registerUser = async (req, res) => {
  try {
    const { username, emailid, password } = req.body;
    console.log("req.body", req.body);
    const checkuser = await userModel.findOne({
      $or: [{ username: username }, { password: password }],
    });

    console.log(checkuser);

    if (checkuser) {
      console.log("user already exist");

      return res.status(200).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(("hashpassword", hashPassword));

    const newUser = await userModel({
      username: username,
      emailid: emailid,
      password: hashPassword,
    });

    await res
      .status(200)
      .json({ message: "user registered successfully", message1: newUser });
    await newUser.save();

    console.log("registered success", newUser);
  } catch (error) {
    console.log(error);

    await res.status(500).json({ message: "user register failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { emailid, password } = req.body;

    const user = await userModel.findOne({ emailid: emailid });

    if (!user) {
      console.log(user);

      return res.status(200).json({ message: "user not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("PASSWORD MATCH>>", passwordMatch);
      console.log(password);

      res.status(200).json({ message: "invalid user password" });
    }

    console.log("PASSWORD MATCH>>", passwordMatch);

    const token = jwt.sign({ _id: user._id }, process.env.SECTERT_KEY);
    res.status(200).json({ message: "Login successfully", token: token });
    console.log("token sendinf from BE>>>", token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "invalid user" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "error in finding user" });
  }
};

//////////////// PASSWORD RESET

exports.resetPassword = async (req, res) => {
  try {
    const emailid = req.body.emailid;

    console.log(emailid);

    const user = await userModel.findOne({ emailid: emailid });

    if (!user) {
      return res.status(200).json({ message: "user not found" });
    }

    const resetToken = Math.random().toString(36).slice(-8);
    const resetPasswordTokenExpiery = Date.now() + 360000;

    console.log(resetToken);

    await userModel.updateOne(
      { emailid: emailid },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordTokenExpiery: resetPasswordTokenExpiery,
        },
      }
    );

    await user.save();

    const modifieduser = await userModel.findOne({ emailid: emailid });

    console.log(modifieduser);

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kuralnithi1999@gmail.com",
        pass: process.env.apppaassword,
      },
    });

    const message = {
      from: "kuralnithi1999@gmail.com",
      to: emailid,
      subject: "PASSWORD RESET MAIL",
      text: `reset token>>>>    ${resetToken}`,
    };

    mailTransporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("error in sending mail>>>>>>>>", err);
        return res.status(500).json({ message: "error in reseting password" });
      }

      console.log("mail sent successfully");

      res.status(200).json({ message: "mail sent successfully to emailid" });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.resetPasswordpage = async (req, res) => {
  console.log("insidee reset function>>>>>>>>>>>");

  try {
    const token = req.body.token;
    const password = req.body.password;
    console.log(token);

    if (!token) {
      return console.log("token missing");
    }

    const user = await userModel.findOne({ resetPasswordToken: token });
    console.log("userrr>>>", user);
    if (!user) {
      console.log("user not found");

      return res.status(200).json({ message: "user not found" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const updatedUser = await userModel.updateOne(
      { resetPasswordToken: token },
      {
        $set: {
          resetPasswordToken: null,
          resetPasswordTokenExpiery: null,
          password: hashPassword,
        },
      }
    );

    console.log(updatedUser);

    res.status(200).json({ message: "password reset successfull" });
    console.log("password rest success");
  } catch (error) {
    res.status(500).json({ message: "error in resetting password" });
  }
};

//.............Oauth

exports.Oauthuser = async (req, res) => {
  try {
    const credentials = req.user;
    const usertype = req.body.usertype;

    const checkUserAlreadyExists = await userModel.findOne({
      username: credentials.name,
    });

    if (checkUserAlreadyExists) {
      return res.status(200).json({
        message: "Oauth- user found in database",
        data: checkUserAlreadyExists,
      }); //});
    }

    const newUser = await userModel.create({
      username: credentials.name,
      emailid: credentials.email,
      usertype: usertype,
    });

    if (newUser) {
      console.log("newUserOauth: " + newUser);

      return res.status(200).json({
        message: "new Oauth user created successfully",
        data: newUser,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error  OAuth user creation or login", data: error });
  }
};
