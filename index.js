const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./services/passport.service');

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/auth.routes')(app);
require('./routes/billing.routes')(app);
require('./routes/survey.routes')(app);

// app.get('/', (req, res) => {
//   res.send({ message: "welcome to summoner's rift" });
// });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
