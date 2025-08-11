import express from "express";

const app = express();

const users = [];

app.post("/usuarios", (req, res) => {
  res.send("User created successfully!");
});

app.get("/ususarios", (req, res) => {
  res.send("Hello, users!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
