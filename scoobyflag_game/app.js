const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 1650;

require("./routes")(app);

app.use((err, req, res, next) => {
  if (err.status === undefined) {
    return res.status(500).send(err.message);
  } else {
    return res.status(err.status).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
