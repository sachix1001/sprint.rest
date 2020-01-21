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

  function findIndex(idOrName) {
    let index;
    // if it's a name
    if (isNaN(Number(idOrName))) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].name === idOrName) {
          index = i;
        }
      }
    } else {
      // if it's an ID
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].id === idOrName) {
          index = i;
        }
      }
    }
    return index;
  }

  app.get("/api/pokemon/:a", (req, res) => {
    const index = findIndex(req.params.a);
    res.send(pokeData.pokemon[index]);
  });

  app.patch("/api/pokemon/:idOrName", (req, res) => {
    const index = findIndex(req.params.idOrName);
    const data = req.body;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      pokeData.pokemon[index][keys[i]] = data[keys[i]];
    }
    res.end();
  });

  app.delete("/api/pokemon/:idOrName", (req, res) => {
    const index = findIndex(req.params.idOrName);
    pokeData.pokemon.splice(index, 1);
    res.end();
  });

  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    const index = findIndex(req.params.idOrName);
    if (pokeData.pokemon[index].hasOwnProperty("evolutions")) {
      res.send(pokeData.pokemon[index].evolutions);
    } else {
      res.send([]);
    }
  });

  app.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    const index = findIndex(req.params.idOrName);
    if (pokeData.pokemon[index].hasOwnProperty("Previous evolution(s)")) {
      res.send(pokeData.pokemon[index]["Previous evolution(s)"]);
    } else {
      res.send([]);
    }
  });

  return app;
};

module.exports = { setupServer };
