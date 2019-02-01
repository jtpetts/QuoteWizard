const express = require("express");
const router = express.Router();
const _ = require("lodash");
const asyncMiddleware = require("../middleware/async");
const AutoLeadsModel = require("../models/autoLeadsModel");

//__________________________________________________________________________________________________________
const filters = [
  { query: "consumer_state", node: "consumer", key: "state" },
  { query: "vehicle_make", node: "vehicle", key: "make" },
  { query: "coverage_formerinsurer", node: "coverage", key: "former_insurer" }
];

router.get(
  "/",
  asyncMiddleware(async (request, response) => {
    if (_.isEmpty(request.query)) {
      const leads = await AutoLeadsModel.getAllLeads();
      response.send(leads);
    } else {
      const filter = filters.find(f => request.query.hasOwnProperty(f.query));

      // error on invalid search criteria
      if (filter == null)
        return response.status(404).send("Invalid Search Criteria");

      const leads = await AutoLeadsModel.filterLeads(
        filter.node,
        filter.key,
        request.query[filter.query]
      );
      response.send(leads);
    }
  })
);

//__________________________________________________________________________________________________________
router.get(
  "/:id",
  asyncMiddleware(async (request, response) => {
    const lead = await AutoLeadsModel.findById(request.params.id);
    if (lead == null)
      return response
        .status(404)
        .send("The lead with the given ID was not found");

    response.send(lead);
  })
);

module.exports = router;
