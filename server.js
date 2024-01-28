const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/loginSignupDB");


mongoose.connection.on("connected", () => {
  console.log("DB connected");
});


const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  //check email
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        //check password
        if (password === user.password) {
          res.send({ message: "Login successfully", user: user });
        } else {
          res.send({ message: "Password and confirm password didn't match" });
        }
      } else {
        res.send({ message: "Please login to proceed" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
});

app.post("/signup", (req, res) => {
  const { fname, lname, email, password } = req.body;
  //check email
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.send({ message: "User is already registered" });
      } else {
        const newUser = new User({
          fname,
          lname,
          email,
          password,
        });
        return newUser.save();
      }
    })
    .then(() => {
      res.send({ message: "Account has been created!! Please Login" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
});

app.listen(8000, () => {
  console.log("Server starting at 8000");
});
