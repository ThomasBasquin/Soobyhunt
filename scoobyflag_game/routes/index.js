const { readdirSync } = require("fs");

module.exports = (app) => {
  readdirSync(__dirname)
    .filter((filename) => filename !== "index.js")
    .forEach((filename) => {
      const route = require(`./${filename}`);
      route(app);
    });
};
