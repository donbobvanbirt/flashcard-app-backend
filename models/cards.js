const fs = require('fs');
const path = require('path');

const uuid = require('uuid')

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

// exports.getCard = function(cb) {
//
// }

exports.add = function(newData, cb) {
  // newData[id] = uuid();
  // console.log('newData', newData);
  let json = JSON.stringify(newData);

  fs.writeFile(filename, json, cb)
}

exports.create = function(newItem, cb) {
  newItem.id = uuid();
  console.log('newItem', newItem);
  exports.getAll((err, items) => {
    if(err) return cb(err);

    items.push(newItem);

    exports.add(items, cb);
  })
}
