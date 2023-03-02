const axios = require("axios");
const jsonData = require("../assets/gameConfig.json");

const get = async (req, res) => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/game/" + req.query.gameId
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  get,
};
