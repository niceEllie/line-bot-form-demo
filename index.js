const express = require("express");
const bodyParser = require("body-parser");
const line = require("./line");

const app = express();

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.post("/webhook", (req, res, next) => {
  req.body = JSON.parse(req.rawBody.toString());
  next();
}, line.handler);

app.get("/", (req, res) => res.send("LINE Bot Demo Running"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
