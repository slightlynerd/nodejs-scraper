const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/last-fm', (req, res) => {

  // url we will scape from
  const URL = 'https://www.last.fm/music/+releases/coming-soon/popular';
  const titles = [];
  const coverArts = [];
  const artists = [];
  const releaseDates = [];
  const comingSoon = [];
  request(URL, (error, response, html) => {
    if (error) return;

    const $ = cheerio.load(html);
    $('h3.album-grid-item-title').filter(function() {
      const data = $(this);
      titles.push(data.children().first().text());
    });
    $('img.cover-art').filter(function() {
      const data = $(this);
      console.log(data.children().first().children());
      // coverArts.push(data.children().first().src);
    });
    for (let i = 0; i < titles.length; i++) {
      let obj = {};
      obj.title = titles[i];
      // console.log(coverArts[i]);
      // obj.coverArt = coverArts[i];
      comingSoon.push(obj);
    }
    res.json(comingSoon);
  });
});

app.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${PORT}`);
});