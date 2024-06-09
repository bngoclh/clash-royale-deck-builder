const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const deckRoutes = require('./src/routes/deckRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/decks', deckRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
