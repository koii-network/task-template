// Tests for the Data class
const levelup = require('levelup');
const leveldown = require('leveldown');
const Data = require('../model/data');
const Item = require('./test_item');

const db = levelup(leveldown('./my_test_db'));

const testData = [
  new Item({ id: 1, name: 'Item 1', description: 'First item' }),
  new Item({ id: 2, name: 'Item 2', description: 'Second item' }),
//   new Item({ id: 3, name: 'Item 3', description: 'Third item' }),
];

// console.log('Running tests...', testData);

const data = new Data('test', db, testData);

// // Test creating an item
// data.createItems(testData)
//   .then(() => {
//     console.log('Create item test passed');
//   })
//   .catch((err) => {
//     console.error('Create item test failed:', err);
//   });



// // Test creating an item
// data.create(new Item({ id: 4, name: 'Item 4', description: 'Fourth item' }))
//   .then(() => {
//     console.log('Create item test passed');
//   })
//   .catch((err) => {
//     console.error('Create item test failed:', err);
//   });

// // Test retrieving an item
// data.get(2)
// .then((item) => {
//     console.log("return result is ", item)
// })

// // Test getting a list of items
// data.getList()
//   .then((list) => {
//     console.log('Get list ', list);
//   })
//   .catch((err) => {
//     console.error('Get list test failed:', err);
//   });

// // Test pending item functionality
// data.addPendingItem(5, new Item({ id: 5, name: 'Item 5', description: 'Fifth item' }))
//   .then(() => {
//     console.log('Add pending item test passed');
//   })
//   .catch((err) => {
//     console.error('Add pending item test failed:', err);
//   });

// Test getting pending List
data.getPendingList()
  .then((list) => {
    console.log('Get pending items test passed', list);
  })
  .catch((err) => {
    console.error('Get pending items test failed:', err);
  });

// // Test getting pending item
// data.getPendingItem(5)
//   .then((item) => {
//     console.log('Get pending item test passed', item);
//   })
//   .catch((err) => {
//     console.error('Get pending item test failed:', err);
//   });


// // Clean up the test database
// db.close(() => {
//   console.log('Database closed');
// });