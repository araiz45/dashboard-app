import express from "express";
import userModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import cookie from "cookie";
import jwt from "jsonwebtoken";
const router = express.Router();
const privateKey = "kdsljflksdjflksdj";
const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: "production" === "production",
  sameSite: "Lax",
  path: "/",
};

router.get("/getting", (req, res) => {
  res.json("thisi si sdfjsfa;lskdj");
});

router.post("/register", async (req, res) => {
  const { username, password, admin } = req.body;
  if (!username || !password) {
    return res.status(400).json("Incomplete Credentials");
  }
  try {
    const userExist = await userModel.findOne({ username });
    if (userExist) {
      return res.status(400).json("user already exists");
    }
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);
    const user = await userModel.create({
      username,
      password: hashPassword,
      admin,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.get("/getUser", async (req, res) => {
  try {
    const users = await userModel.find({}, "-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json("Internal Server Error");
    console.log(error);
  }
});

router.post("/deleteUser", async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const findUser = await userModel.findByIdAndDelete(id);
      res.json("User has been deleted Sucessfully");
    }
  } catch (error) {}
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await userModel.findOne({ username });
    if (!findUser) {
      return res.status(400).json("Unauthorized user");
    }
    const comparePassowrd = await bcryptjs.compare(password, findUser.password);
    if (!comparePassowrd) {
      return res.status(400).json("Unauthorized User");
    }
    const tokenData = {
      username: findUser.username,
      id: findUser._id,
      admin: findUser.admin,
    };
    jwt.sign(tokenData, privateKey, {}, function (err, token) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("dashToken", token, cookieOptions)
      );
      res.cookie("token", token);
      res.send("Login Success");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.get("/verify", async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token || null;
    console.log(token);
    if (token) {
      const decodedToken = await jwt.verify(token, privateKey);
      res.json(decodedToken);
    } else {
      return res.status(400).json("Forbidden");
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("dashToken");
  res.send("Logout Successfull");
});

export default router;
