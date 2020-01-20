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
      await request.post("/api/pokemon").send(expected);
      pokeData.pokemon.length.should.equal(152);
    });
  });

  describe("GET /api/pokemon/:id - return 1 pokemon matching id or name", () => {
    it("should return 1 matching pokemon by ID", async () => {
      const res = await request.get("/api/pokemon/002");
      JSON.parse(res.text).id.should.equal("002");
    });
    it("should return 1 matching pokemon by NAME", async () => {
      const res = await request.get("/api/pokemon/Ivysaur");
      JSON.parse(res.text).name.should.equal("Ivysaur");
    });
  });

  describe("PATCH /api/pokemon/:idOrName - should allow partial modifications to a Pokemon", () => {
    it("should change the data of one pokemon", async () => {
      const expected = {
        types: ["type modified"],
        resistant: ["resistant modified"],
        weaknesses: ["weakness1", "weakness2"],
      };
      console.log(pokeData.pokemon);
      const res = await request.patch("/api/pokemon/001").send(expected);
      // console.log(pokeData.pokemon);
      pokeData.pokemon[0].types.should.equal(["type modified"]);
      pokeData.pokemon[0].resistant.should.equal(["resistant modified"]);
      pokeData.pokemon[0].weaknesses.should.equal(["weakness1", "weakness2"]);
    });
  });
});
