const fs = require("fs");
const express = require("express");
const beanController = require("../controllers/beanController");

const router = express.Router();

router
  .route("/")
  .get(beanController.getAllBeans)
  .post(beanController.createBean);
router
  .route("/:id")
  .get(beanController.getBeanById)
  .patch(beanController.updateBean)
  .delete(beanController.deleteBean);

module.exports = router;
