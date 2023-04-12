const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

app = express();
const log = console.log;
app.use(bodyParser.urlencoded({ extended: true }));
var url =
  "mongodb+srv://cluster0.xp8e5go.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&ssl=true";
const credentials =
  "/home/safalbolakhe/Desktop/X509-cert-1008396812902061985.pem";
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  sslKey: credentials,
  sslCert: credentials,
};

async function connectDB() {
  try {
    await mongoose.connect(url, connectionParams);
    console.log("Connection Successful...");
  } catch (error) {
    console.log(error.body);
  }
}

const todoSchema = mongoose.Schema({
  todo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});
const todoModel = mongoose.model("todos", todoSchema);
connectDB();

async function savetoDb(req, res) {
  try {
    const newTodo = new todoModel({ todo: req.body.inputfield });
    // console.log(req.body.inputfield);
    // console.log(newTodo);
    await newTodo.save();
    res.redirect("/");
    // res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
app
  .set("view engine", "ejs")
  .get("/", async (req, res) => {
    const allTodos = await todoModel.find();
    todoCollection = allTodos;
    res.render("todo", { todo: allTodos });
  })
  .post("/data", async (req, res) => {
    await savetoDb(req, res);
    console.log("Succesfully added ... ")
  })
  .get("/delete/:_id", async (req, res) => {
    const {_id} = req.params;
    // console.log(_id);
    try {
      await todoModel
        .deleteOne({ _id });
        console.log("Succesfully deleted ... ")
        res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  })
  .listen(3000);
