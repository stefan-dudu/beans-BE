const fs = require("fs");
const express = require("express");
const app = express();
const port = 5001;

const beans = JSON.parse(fs.readFileSync(`${__dirname}/data/beans.json`));

app.get("/api/v1/beans", (req, res) => {
  res.status(200).json({
    status: "success",
    results: beans.length,
    data: { beans },
  });
});

app.listen(port, () => {
  console.log(`it ran 2nd time`);
});
