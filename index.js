import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send({ message: "welcome to summoner's rift" });
});

const PORT = process.env.PORT || 5000;
app.listen(5000);
