const express = require("express");
const path = require("path");

const api = express();

api.use(express.static(path.join(__dirname, "public")));

api.use("/", express.static("index.html"));
api.get("/singleplayer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "singleplayer.html"));
});
api.get("/multiplayer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "multiplayer.html"));
});

module.exports = api;
