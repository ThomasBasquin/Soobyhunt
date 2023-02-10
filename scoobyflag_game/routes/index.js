const { readdirSync } = require("fs");

module.exports = (app) => {
  readdirSync(__dirname)
    .filter((filename) => filename !== "index.js")
    .forEach((filename) => {
      require("./" + filename).forEach((r) => {
        app[r.method](r.url, r.func);
      });
    });
};
