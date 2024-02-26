const express = require("express");
const app = express();
const port = 5001;

app.get("/", (req, res) => {
  // res.send("Data beeing sent from BE");
  res.json({ id: 2, user: "mike2" });
});

// app.post("/", (req, res) => {
//   res.send("you can post here");
// });

app.listen(port, () => {
  console.log(`it ran 2nd time`);
});
