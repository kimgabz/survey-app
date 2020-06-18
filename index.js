const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./services/passport.service');

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// app.get('/', (req, res) => {
//   res.send({ message: "welcome to summoner's rift" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT);
