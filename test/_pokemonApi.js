const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
chai.should();
const pokeData = require("../src/data");

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = setupServer();
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });

  describe("GET /api/pokemon - returning json", () => {
    it("should return JSON", async () => {
      const res = await request.get("/api/pokemon");
      res.should.be.json;
    });
  });
  describe("GET /api/pokemon - return N numbers of pokemon if limit is defined", () => {
    it("should return 5 pokemon", async () => {
      const res = await request.get("/api/pokemon?limit=5");
      JSON.parse(res.text).length.should.equal(5);
    });
  });
  describe("GET /api/pokemon - return all pokemon if limit is NOT defined", () => {
    it("should return 151 pokemon", async () => {
      const res = await request.get("/api/pokemon");
      JSON.parse(res.text).length.should.equal(151);
    });
  });

  describe("POST /api/pokemon - should add a Pokemon", () => {
    it("should change the data length to 152", async () => {
      const expected = {
        id: 152,
      };
      const res = await request.post("/api/pokemon").send(expected);
      pokeData.pokemon.length.should.equal(152);
    });
  });
});
