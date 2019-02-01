module.exports = function(error, request, response, next) {
  // log the exception
  console.log(error);
  response.status(500).send("Something failed!");
};
