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

  describe("DELETE /api/types/:name - deletes a type", () => {
    it("should return 1 array of all types excluding the deleted type", async () => {
      const expected = [...pokeData.types];
      expected.pop();
      await request.delete("/api/types/TestType");
      pokeData.types.length.should.equal(17);
      pokeData.types.should.eql(expected);
    });
  });

  describe("GET /api/types/:type/pokemon - returns all pokemons with the given type", () => {
    it("should return 1 array of pokemon's ID and name", async () => {
      const res = await request.get("/api/types/Normal/pokemon");
      JSON.parse(res.text).length.should.equal(22);
    });
  });

  describe("GET /api/attacks - all available attacks up to limit n", () => {
    it("should return 1 array of all attacks", async () => {
      const res = await request.get("/api/attacks");
      JSON.parse(res.text).length.should.equal(124);
    });
    it("should return n attacks array if limit is defined", async () => {
      const res = await request.get("/api/attacks?limit=5");
      JSON.parse(res.text).length.should.equal(5);
    });
  });

  describe("GET /api/attacks/fast - all available fast attacks up to limit n", () => {
    it("should return 1 array of all attacks", async () => {
      const res = await request.get("/api/attacks/fast");
      JSON.parse(res.text).length.should.equal(pokeData.attacks.fast.length);
    });
    it("should return n attacks array if limit is defined", async () => {
      const res = await request.get("/api/attacks/fast?limit=5");
      JSON.parse(res.text).length.should.equal(5);
    });
  });

  describe("GET /api/attacks/special - all available special attacks up to limit n", () => {
    it("should return 1 array of all attacks", async () => {
      const res = await request.get("/api/attacks/special");
      JSON.parse(res.text).length.should.equal(pokeData.attacks.special.length);
    });
    it("should return n attacks array if limit is defined", async () => {
      const res = await request.get("/api/attacks/special?limit=5");
      JSON.parse(res.text).length.should.equal(5);
    });
  });

  describe("GET /api/attacks/:name - returns one attack with matching NAME", () => {
    const expected = {
      name: "Ember",
      type: "Fire",
      damage: 10,
    };
    it("should return 1 attack object matching NAME", async () => {
      const res = await request.get("/api/attacks/Ember");
      JSON.parse(res.text).should.eql(expected);
    });
    it("should return an empty object if NO matching NAME", async () => {
      const res = await request.get("/api/attacks/Sachi");
      JSON.parse(res.text).should.eql({});
    });
  });

  describe("GET /api/attacks/:name/pokemon - return 1 array if pokemon has attack", () => {
    it("should return array of pokemon that has attack", async () => {
      const res = await request.get("/api/attacks/Bubble/pokemon");
      JSON.parse(res.text).should.eql([]);
    });
    it("should return empty array if no pokemon have attack", async () => {
      const res = await request.get("/api/attacks/Sachi/pokemon");
      JSON.parse(res.text).should.eql([]);
    });
  });

  describe("POST /api/attacks/fast - adds a fast attack", () => {
    it("should return 1 array of all attacks including the new attack", async () => {
      const expected = [...pokeData.attacks.fast];
      const testAttack = {
        name: "TestAttack",
        type: "Normal",
        damage: 1000,
      };
      expected.push(testAttack);
      const response = await request
        .post("/api/attacks/fast")
        .send({ attacks: testAttack });
      JSON.parse(response.text).should.eql(expected);
    });
  });

  describe("POST /api/attacks/special - adds a special attack", () => {
    it("should return 1 array of all attacks including the new attack", async () => {
      const expected = [...pokeData.attacks.special];
      const testAttack = {
        name: "SpecialAttack",
        type: "Normal",
        damage: 1000000,
      };
      expected.push(testAttack);
      const response = await request
        .post("/api/attacks/special")
        .send({ attacks: testAttack });
      JSON.parse(response.text).should.eql(expected);
    });
  });

  describe("PATCH /api/attacks/:name - patches one attack with matching NAME", () => {
    const expected = {
      name: "TestName",
      type: "Test",
      damage: 999,
    };
    it("should patch an attack with matching name", async () => {
      await request.patch("/api/attacks/Tackle").send(expected);
      pokeData.attacks.fast[0].should.eql(expected);
    });
  });

  describe("DELETE /api/attacks/:name - delete one attack with matching NAME", async () => {
    it("should patch an attack with matching name", async () => {
      const expected = [...pokeData.attacks.fast];
      expected.unshift();
      await request.delete("/api/attacks/Tackle");
      pokeData.attacks.fast.should.eql(expected);
    });
  });
});
