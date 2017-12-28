const express = require('express');
const router = express.Router();
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();

router.get('/', (req, res, next) => {
  const {data} = req.query;
  console.log(data);
  const attributes = {fill: 'red', stroke: 'black'};
  const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};
  const svg = textToSVG.getSVG(data, options);
  res.status(200).send(JSON.stringify(svg))
})

module.exports = router;
