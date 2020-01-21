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
        types: ["Bug"],
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
      await request.patch("/api/pokemon/001").send(expected);
      pokeData.pokemon[0].types.should.eql(["type modified"]);
      pokeData.pokemon[0].resistant.should.eql(["resistant modified"]);
      pokeData.pokemon[0].weaknesses.should.eql(["weakness1", "weakness2"]);
    });
  });

  describe("DELETE /api/pokemon/:idOrName - should delete the Pokemon", () => {
    it("should change the data length to 150 - used ID", async () => {
      const testLength = await pokeData.pokemon.length;
      await request.delete("/api/pokemon/002");
      pokeData.pokemon.length.should.equal(testLength - 1);
    });
    it("should change the data length to 150 - used a NAME", async () => {
      const testLength = await pokeData.pokemon.length;
      await request.delete("/api/pokemon/Venusaur");
      pokeData.pokemon.length.should.equal(testLength - 1);
    });
  });

  describe("GET /api/pokemon/:idOrName/evolutions - return 1 array if pokemon has evolutions", () => {
    it("should return 1 matching evolutions array by ID", async () => {
      const expected = [
        {
          id: 5,
          name: "Charmeleon",
        },
        {
          id: 6,
          name: "Charizard",
        },
      ];

      const res = await request.get("/api/pokemon/004/evolutions");
      JSON.parse(res.text).should.eql(expected);
    });
    it("should return 1 matching evolutions array by NAME", async () => {
      const expected = [
        {
          id: 6,
          name: "Charizard",
        },
      ];
      const res = await request.get("/api/pokemon/Charmeleon/evolutions");
      JSON.parse(res.text).should.eql(expected);
    });

    it("should return empty array by ID if no evolutions", async () => {
      const res = await request.get("/api/pokemon/078/evolutions");
      JSON.parse(res.text).should.eql([]);
    });
    it("should return empty array by NAME if no evolutions", async () => {
      const res = await request.get("/api/pokemon/Slowbro/evolutions");
      JSON.parse(res.text).should.eql([]);
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions/previous - return 1 array if pokemon has previous evolutions", () => {
    const expected = [
      {
        id: 79,
        name: "Slowpoke",
      },
    ];
    it("should return 1 matching previous evolutions array by ID", async () => {
      const res = await request.get("/api/pokemon/080/evolutions/previous");
      JSON.parse(res.text).should.eql(expected);
    });
    it("should return 1 matching previous evolutions array by NAME", async () => {
      const res = await request.get("/api/pokemon/Slowbro/evolutions/previous");
      JSON.parse(res.text).should.eql(expected);
    });

    it("should return empty array by ID if no evolutions", async () => {
      const res = await request.get("/api/pokemon/079/evolutions/previous");
      JSON.parse(res.text).should.eql([]);
    });
    it("should return empty array by NAME if no evolutions", async () => {
      const res = await request.get(
        "/api/pokemon/Slowpoke/evolutions/previous"
      );
      JSON.parse(res.text).should.eql([]);
    });
  });

  describe("GET /api/types - all available types up to limit n", () => {
    it("should return 1 array of all types", async () => {
      const res = await request.get("/api/types");
      JSON.parse(res.text).length.should.equal(17);
    });
    it("should return n types array if limit is defined", async () => {
      const res = await request.get("/api/types?limit=5");
      JSON.parse(res.text).length.should.equal(5);
    });
  });

  describe("POST /api/types - adds a type", () => {
    it("should return 1 array of all types including the new type", async () => {
      const expected = [...pokeData.types];
      expected.push("TestType");
      const response = await request
        .post("/api/types")
        .send({ types: "TestType" });
      JSON.parse(response.text).should.eql(expected);
    });
  });
});
