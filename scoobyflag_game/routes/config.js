const config = require("../controllers/config");

module.exports = [
  {
    method: "get",
    url: "/config",
    func: config.test,
  },
];
