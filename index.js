const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send({ message: "welcome to summoner's rift" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
