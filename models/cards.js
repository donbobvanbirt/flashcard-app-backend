const fs = require('fs');
const path = require('path');

const uuid = require('uuid')
const lodash = require('lodash')

const filename = path.join(__dirname, '../data/cards.json');


exports.getAll = function(cb) {

  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    try {
      var data = JSON.parse(buffer);
    } catch(e) {
      var data = [];
    }

    cb(null, data);
  });
}

exports.getRand = function(query, cb) {
  exports.getAll((err, cards) => {
    if(err) return cb(err);

    let filteredCards;
    if(query.subject) {
      filteredCards = cards.filter(card => {
        return card.subject === query.subject || query.subject.indexOf(card.subject) > -1;
      })
    } else {
      filteredCards = cards;
    }

    let shuffledCards = lodash.shuffle(filteredCards);
    let card = shuffledCards[0];
    if(card) {
      return cb(null, [card.question, card.id]);
    } else {
      console.log('err');
      return cb('Subject not found');
    }
  })
}

exports.getById = function(id, cb) {
  exports.getAll((err, cards) => {
    if(err) return cb(err);

    let specificCard = cards.filter(card => {
      return card.id === id;
    })

    return cb(null, specificCard)
  })
}

exports.checkAnswer = function(id, answer, cb) {
  exports.getById(id, (err, card) => {
    if(err) return cb(err);
    if(card[0].answer === answer) {
      cb(null, 'CORRECT!!')
    } else {
      cb(null, 'WRONG!')
    }

  })
}

exports.add = function(newData, cb) {
  let json = JSON.stringify(newData);
  fs.writeFile(filename, json, cb)
}

exports.create = function(newItem, cb) {
  newItem.id = uuid();
  exports.getAll((err, items) => {
    if(err) return cb(err);

    items.push(newItem);

    exports.add(items, cb);
  })
}

exports.remove = function(id, cb) {
  exports.getAll((err, items) => {
    if(err) return cb(err);

    let newItems = items.filter(card => {
      return card.id !== id;
    })
    exports.add(newItems, cb);

  })
}

exports.edit = function(id, body, cb) {
  exports.getAll((err, items) => {
    if(err) return cb(err);

    console.log('body:', body);

    let newItems = items.filter(card => {
      return card.id !== id;
    })

    let editingItem = items.filter(card => {
      return card.id === id;
    })

    let newItem = {
      question:  body.question || editingItem[0].question,
      answer: body.answer || editingItem[0].answer,
      subject: body.subject || editingItem[0].subject,
      id:  editingItem[0].id
    };

    newItems.push(newItem);

    exports.add(newItems, cb);

  })
}
