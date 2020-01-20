const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/pokemon", (req, res) => {
    const n = req.query.limit;
    if (n !== undefined) {
      const results = [];
      // console.log(Array.isArray(pokeData.pokemon));
      for (let i = 0; i < n; i++) {
        results.push(pokeData.pokemon[i]);
      }
      res.send(results);
    } else {
      res.send(pokeData.pokemon);
    }
  });

  app.post("/api/pokemon", (req, res) => {
    pokeData.pokemon.push(req.body);
    res.send(req.body);
  });

  function isID(value) {
    return !isNaN(Number(value));
  }

  app.get("/api/pokemon/:a", (req, res) => {
    const value = req.params.a;
    if (isID(value)) {
      const index = parseInt(value) - 1;
      res.send(pokeData.pokemon[index]);
      return;
    }
    for (let i = 0; i < pokeData.pokemon.length; i++) {
      if (pokeData.pokemon[i].name === value) {
        res.send(pokeData.pokemon[i]);
      }
    }
  });

  app.patch("/api/pokemon/:idOrName", (req, res) => {
    const idOrName = req.params.idOrName;
    const data = req.body;
    const keys = Object.keys(data);
    if (isID(idOrName)) {
      for (let i = 0; i < keys.length; i++) {
        const index = parseInt(idOrName) - 1;
        pokeData.pokemon[index][keys[i]] = data[keys[i]];
      }
      res.end();
      return;
    }
    for (let i = 0; i < pokeData.pokemon.length; i++) {
      if (pokeData.pokemon[i].name === idOrName) {
        for (let j = 0; j < keys.length; j++) {
          pokeData.pokemon[i][keys[j]] = data[keys[j]];
        }
      }
    }
    res.end();
  });

  return app;
};

module.exports = { setupServer };
