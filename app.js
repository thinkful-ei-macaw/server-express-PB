const express = require("express");
const morgan = require("morgan");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(morgan("common")); // let's see what 'common' format looks like
const apps = require("./books-data");

app.get("/apps", (req, res) => {
  let results = [...apps];
  const { genre = "", sort } = req.query;
  if (sort) {
    if (!["App", "Rating"].includes(sort)) {
      return res.status(400).send("sort must be one of app or rating");
    }
  }
  if (genre) {
    if (
      ![
        "Adventure",
        "Action & Adventure",
        "Arcade",
        "Casual",
        "Card",
        "Pretend Play",
        "Action",
        "Strategy",
        "Puzzle"
      ].includes(genre)
    ) {
      return res.status(400).send("must enter valid genre");
    }
    results = apps.filter(app =>
      app.Genres.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  res.json(results);
});

module.exports = app;
