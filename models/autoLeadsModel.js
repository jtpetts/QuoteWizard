const readfile = require("fs-readfile-promise");
const FILENAME = "auto.leads.json";

async function loadData() {
  const fileContents = await readfile(FILENAME, "utf8");
  return await JSON.parse(fileContents);
}

async function getAllLeads() {
  return await loadData();
}

async function findById(inId) {
  const id = inId.toString();
  const leads = await loadData();

  return leads.find(lead => lead.id == id);
}

// performs a case insensitive search
async function filterLeads(inNode, inKey, inValue) {
  const leads = await loadData();

  // vehicle is an array, so a nested filter must be used
  if (inNode == "vehicle")
    return leads.filter(lead => {
      vehicle = lead.vehicle.find(
        v =>
          v[inKey].localeCompare(inValue, undefined, {
            sensitivity: "accent"
          }) == 0
      );
      return vehicle != null;
    });

  // the consumer and coverage nodes are not arrays
  return leads.filter(
    lead =>
      lead[inNode][inKey].localeCompare(inValue, undefined, {
        sensitivity: "accent"
      }) == 0
  );
}

module.exports = { getAllLeads, findById, filterLeads };
