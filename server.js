const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
const port = 5001;

const beans = JSON.parse(fs.readFileSync(`${__dirname}/data/beans.json`));

const getAllBeans = (req, res) => {
  res.status(200).json({
    status: "success",
    results: beans.length,
    data: { beans },
  });
};

const createBean = (req, res) => {
  const newId = beans[beans.length - 1].id + 1;
  const newBean = Object.assign({ id: newId }, req.body);
  beans.push(newBean);
  fs.writeFile(`${__dirname}/data/beans.json`, JSON.stringify(beans), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        beans: newBean,
      },
    });
  });
};

const getBeanById = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  if (id > beans.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  const bean = beans.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: { bean },
  });
};

const updateBean = (req, res) => {
  if (req.params.id * 1 > beans.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      bean: "<Updated bean !..",
    },
  });
};

const deleteBean = (req, res) => {
  if (req.params.id * 1 > beans.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// app.get("/api/v1/beans", getAllBeans);
// app.post("/api/v1/beans", createBean);
// app.get("/api/v1/beans/:id", getBeanById);
// app.patch("/api/v1/beans/:id", updateBean);
// app.delete("/api/v1/beans/:id", deleteBean);

app.route("/api/v1/beans").get(getAllBeans).post(createBean);

app
  .route("/api/v1/beans/:id")
  .get(getBeanById)
  .patch(updateBean)
  .delete(deleteBean);

app.listen(port, () => {
  console.log(`it ran 2nd time`);
});
