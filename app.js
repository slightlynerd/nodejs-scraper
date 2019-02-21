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
  const title = [];
  const coverArt = [];
  const artist = [];
  const releaseDates = [];
  const comingSoon = [];
  request(URL, (error, response, html) => {
    if (error) res.json({message: 'An error occured when fetching the page'});
    
    const $ = cheerio.load(html);
    $('ol').first().find('a.link-block-target').filter(function() {
      const data = $(this).text();
      title.push(data);
    });
    $('ol').first().find('img.cover-art').filter(function() {
      const data = $(this).attr('src');
      coverArt.push(data);
    });
    $('ol').first().find('p.album-grid-item-artist').filter(function() {
      const data = $(this).text();
      const filteredData = data.replace('\n', '').trim();
      artist.push(filteredData);
    });
    $('ol').first().find('p.album-grid-item-date').filter(function() {
      const data = $(this).text();
      const filteredData = data.replace('\n', '').trim();
      releaseDates.push(filteredData);
    });
    for (let i = 0; i < title.length; i++) {
      let obj = {};
      obj.title = title[i];
      obj.coverArt = coverArt[i];
      obj.artist = artist[i];
      obj.releaseDate = releaseDates[i];
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