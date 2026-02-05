const municipalities = require('../data/municipalities.json');

const getLocations = (req, res) => {
  res.json({ cities: municipalities });
};

module.exports = {
  getLocations
};