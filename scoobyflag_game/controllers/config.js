const axios = require("axios");

const get = async (req, res) => {
  try {
    const id = process.env.id;
    const url = `http://host.docker.internal:8000/game/${id}`;
    const response = await axios.get(url);
    const config = response.data;
    res.json(config);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  get,
};
