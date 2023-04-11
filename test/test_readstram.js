const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelup(leveldown('../localKOIIDB'));

// for (let i = 0; i < 100; i++) { 
//     let key;
//     if (i < 50) key = "proof:" + i;
//     if (i >= 50) key = "linktree:" + i;
//     let value = "value:" + i;
//     db.put(key, value, function (err) {
//             if (err) return console.log('Ooops!', err) // some kind of I/O error
//             console.log('inserted + ' + i)
//         }
//     )
// }

db.createReadStream({
    // gt: 'proofs',
    lt: 'linktree~',
    reverse: true,
    // limit: 10,
    keys: true,
    values: true
})
  .on('data', function (data) {
    console.log( data.key.toString(), '=', data.value.toString())

  })
  .on('error', function (err) {
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    console.log('Stream ended')
  })