const express = require("express");
const app = express();

require("./startup/routes")(app);

// PORT is an environment variable which will set the port for this to listen to.
// process is global
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`listening on port ${port}...`)
);

module.exports = server;
