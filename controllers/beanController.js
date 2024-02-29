const fs = require("fs");
const beans = JSON.parse(fs.readFileSync(`${__dirname}/../data/beans.json`));

// Middlewares
exports.checkID = (req, res, next, val) => {
  console.log(`Bean id is: ${val}`);
  if (req.params.id * 1 > beans.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      satus: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

// Controllers
exports.getAllBeans = (req, res) => {
  res.status(200).json({
    status: "success",
    results: beans.length,
    data: { beans },
  });
};

exports.createBean = (req, res) => {
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

exports.getBeanById = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const bean = beans.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: { bean },
  });
};

exports.updateBean = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      bean: "<Updated bean !..",
    },
  });
};

exports.deleteBean = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
