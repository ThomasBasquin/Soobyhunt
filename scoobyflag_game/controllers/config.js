const jsonData = require("../assets/gameConfig.json");

module.exports = {
  get: (req, res) => {
    res.json(jsonData);
  },
};
