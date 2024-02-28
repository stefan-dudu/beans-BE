const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
const port = 5001;

const beans = JSON.parse(fs.readFileSync(`${__dirname}/data/beans.json`));

app.get("/api/v1/beans", (req, res) => {
  res.status(200).json({
    status: "success",
    results: beans.length,
    data: { beans },
  });
});

// console.log("beans", beans[beans.length - 2]._id);

app.post("/api/v1/beans", (req, res) => {
  const newId = beans[beans.length - 1]._id + 1;
  const newBean = Object.assign({ id: newId }, req.body);
  beans.push(newBean);
  fs.writeFile(`${__dirname}/data/beans.json`, JSON.stringify(beans), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        beans: newBean,
      },
      // beans: newBean,
    });
  });
});

app.listen(port, () => {
  console.log(`it ran 2nd time`);
});
