const PORT = 8000;

const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express();

const Cards = require('./models/cards');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.get('/', (req, res) => {
  res.send('its working!');
})

app.get('/flashcards', (req, res) => {
  Cards.getAll((err, cards) => {
    if(err) {
      return res.status(400).send(err);
    }
    res.send(cards);
  })
})

app.get('/flashcard', (req, res) => {
  Cards.getRand(req.query, (err, card) => {
    if(err) return res.status(400).send(err);
    res.send(card);
  })
})

app.post('/flashcard', (req, res) => {
  // console.log('req.body', req.body);
  Cards.create(req.body, err => {
    if(err) return res.status(400).send(err);
    res.send("card added");
  })
})

app.delete('/flashcard', (req, res) => {
  console.log('req.query.id:', req.query.id);
  Cards.remove(req.query.id, err => {
    if(err) return res.status(400).send(err);
    res.send('card deleted');
  })
})

app.put('/flashcard', (req, res) => {
  console.log('req.query.id:', req.query.id);
  Cards.edit(req.query.id, req.body, err => {
    if(err) return res.status(400).send(err);
    res.send('card updated');
  })
})

app.listen(PORT, err => {
  console.log(err || `Express listening on ${PORT}`);
})
