const express = require("express");
const autoLeads = require("../routes/autoLeadsRoute");
const errorHandler = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.use("/api/autoleads", autoLeads);

  app.use(errorHandler);
};
