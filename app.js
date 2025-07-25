const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// express app
const app = express();

// connect to mongodb & listen for requests
//const dbURI = "mongodb://127.0.0.1/DivyaArora";

//Note: I tried to deploy it on render then I observed code is trying to connect to MongoDB at localhost:27017, but Render does not have a local MongoDB installed, so the connection fails. So we have to Use MongoDB Atlas (cloud-based MongoDB)

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

/*
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => console.log(err));


mongoose
  .connect(process.env.dbURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));
console.log("Mongo URI:", process.env.MONGO_URI);
*/

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/users"); //this will redirect page to /users
});

app.get("/users", (req, res) => {
  User.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      res.render("index", { users: result, title: "Home" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/user/create", (req, res) => {
  res.render("adduser", { title: "Add-User" });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      res.render("details", {
        user: result,
        action: "edit",
        title: "User Details",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/user/create", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      res.redirect("/users");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/edit/:name/:action", (req, res) => {
  const name = req.params.name;
  User.findOne({ name: name }).then((result) => {
    res.render("edit", { user: result, title: "Edit-User" });
  });
});

app.post("/edit/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then((result) => {
    res.redirect("/users");
  });
});

app.post("/users/:id", (req, res) => {
  const name = req.params.name;
  User.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.redirect("/users");
    })
    .catch((err) => {
      console.log(err);
    });
});
