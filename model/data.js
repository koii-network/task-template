const levelup = require('levelup');
const leveldown = require('leveldown');
const Item = require(__dirname + '/item');

class Data {
    constructor (name, db, data) {
        this.name = name;
        this.db = db;
        this.dbprefix = `${name} + ":"`;
        if (data) data.forEach((item) => {
            this.create(item)
            console.log(`Created ${this.fullList.length} new items from a list of ${ data.length}`)
        })
        this.fullList = this.getList();
        this.lastUpdate = Date.now();
    }

    // returns items by id
    get (id) {
        return new Promise((resolve, reject) => {
            this.db.get( createId(id), (err, value) => {
              if (err) {
                console.error("Error in getData", err);
                resolve(null);
              } else {
                resolve(JSON.parse(value || "[]"));
              }
            });
        });
    }   

    getList(options) {
        // if no options supplied, default to a list of stored items by their keys
        if (!options) options = {
            lt: `${ this.name }~`,
            reverse: true,
            keys: true,
            values: false
          };
        return new Promise((resolve, reject) => {
            let dataStore = [];
            this.db.createReadStream(options)
              .on('data', function (data) {
                console.log( data.key.toString(), '=', data.value.toString())
                dataStore.push({ key: data.key.toString(), value: JSON.parse(data.value.toString()) });
              })
              // TODO - add error handling
              .on('error', function (err) {
                console.log('Something went wrong in read linktreesStream!', err);
                reject(err);
              })
              .on('close', function () {
                console.log('Stream closed')
              })
              .on('end', function () {
                console.log('Stream ended')
                resolve(dataStore);
              })
        });
    }

    // adds a new item 
    create (item) {
        item = new Item(item); // item must be an instance of Item
        return db.put( createId(itemId), JSON.stringify(item));
    }  
}

module.exports = Data;