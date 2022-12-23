//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

//--------------------------------- Register page here ---------------------------------------------------

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        }
        else {
            console.log(err)
        }
    });
});

//--------------------------------- Login page here ---------------------------------------------------

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
                else {
                    res.render("login")
                }
            }
        }
    });
});

//--------------------------------- Secrets page here ---------------------------------------------------


app.get("/secrets", function (req, res) {
    res.render("secrets");
});

//--------------------------------- Submit page here ---------------------------------------------------

app.get("/submit", function (req, res) {
    res.render("submit");
});

app.post("/submit", function (req, res) {
    res.send("This is the post")
});

app.listen(3000, function () {
    console.log("Server is running at 3000");
});