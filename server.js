const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");

var PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const path = require("path");
const db = require("./models");







server.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}...`);
})