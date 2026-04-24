require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const Dbcon = require("./app/config/db");
const router = require("./app/routes");
const app = express();
Dbcon();
app.use(cors());
app.use(express.json());
app.use(router);
// app.use("upload", express.static(path.join(__dirname, "/upload")));
// app.use("/upload", express.static("upload"));

const PORT = 4010;
app.listen(PORT, () => {
  console.log(`Server created ${PORT}`);
});
