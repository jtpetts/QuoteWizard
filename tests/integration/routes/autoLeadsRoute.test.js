const request = require("supertest");
const { autoLeadsModel } = require("../../../models/autoLeadsModel");
const _ = require("lodash");

let server;

describe("/api/autoleads", () => {
  beforeEach(async () => {
    server = require("../../../index");
  });

  afterEach(async () => {
    server.close();
  });

  //__________________________________________________________________________________________________________
  describe("GET /", () => {
    it("should return all leads", async () => {
      const response = await request(server).get("/api/autoleads");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(13);
    });
  });

  //__________________________________________________________________________________________________________
  describe("GET /:id", () => {
    it("should return a lead if a valid id is passed", async () => {
      targetId = 514;
      targetName = "Minnie";

      const response = await request(server).get(`/api/autoleads/${targetId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("consumer.first_name", targetName);
    });

    it("should return 404 if an invalid id is passed", async () => {
      const response = await request(server).get(`/api/autoleads/bogus`);
      expect(response.status).toBe(404);
    });
  });

  //__________________________________________________________________________________________________________
  describe("GET /?query_params=X", () => {
    it("should return the leads where the consumer is from WI", async () => {
      const state = "WI";

      const response = await request(server).get(
        `/api/autoleads?consumer_state=${state}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it("should return both leads where the consumer is from IL", async () => {
      const state = "IL";

      const response = await request(server).get(
        `/api/autoleads?consumer_state=${state}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it("should return both leads when the consumer is passed as lowercase il", async () => {
      const state = "il";

      const response = await request(server).get(
        `/api/autoleads?consumer_state=${state}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it("should return no leads where the consumer is from HI", async () => {
      const state = "HI";

      const response = await request(server).get(
        `/api/autoleads?consumer_state=${state}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it("should return 404 because the query parameter is bogus", async () => {
      const state = "IL";

      const response = await request(server).get(
        `/api/autoleads?consumer_bogus=${state}`
      );

      expect(response.status).toBe(404);
    });

    it("should return four leads where the vehicle make is chevrolet (case insensitive)", async () => {
      const make = "chevrolet";

      const response = await request(server).get(
        `/api/autoleads?vehicle_make=${make}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });

    it("should return the lead where the former insurer is That Big Company", async () => {
      const formerInsurer = "That Big Company";
      const targetName = "John";

      const response = await request(server).get(
        `/api/autoleads?coverage_formerinsurer=${formerInsurer}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty(
        "consumer.first_name",
        targetName
      );
    });

    it("should return the four leads where the former insurer is None without returning the blank one", async () => {
      const formerInsurer = "None";

      const response = await request(server).get(
        `/api/autoleads?coverage_formerinsurer=${formerInsurer}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });

    it("should return the lead where the former insurer is blank", async () => {
      const formerInsurer = "";
      const targetName = "Times";

      const response = await request(server).get(
        `/api/autoleads?coverage_formerinsurer=${formerInsurer}`
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty(
        "consumer.first_name",
        targetName
      );
    });
  });
});
