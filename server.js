const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("This is the middleware 🌍");
  next();
});

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

const port = 5001;
const beans = JSON.parse(fs.readFileSync(`${__dirname}/data/beans.json`));

// Route handlers
const getAllBeans = (req, res) => {
  // console.log(req.requestTime);
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

/// ----------------

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "this route is not yet defined",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "this route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "this route is not yet defined",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "this route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "this route is not yet defined",
  });
};

// Routes
const beansRouter = express.Router();
app.use("/api/v1/beans", beansRouter);

beansRouter.route("/").get(getAllBeans).post(createBean);
beansRouter.route("/:id").get(getBeanById).patch(updateBean).delete(deleteBean);

const userRouter = express.Router();
app.use("/api/v1/users", userRouter);
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

// Start server
app.listen(port, () => {
  console.log(`it ran 2nd time`);
});
