const levelup = require('levelup');
const leveldown = require('leveldown');

class data {
    constructor (name, data) {
        this.name = name;
        this.dbprefix = `${name} + ":"`;
        data.forEach((item) => {
            this.create(item)
        })
        console.log(`Created ${this.fullList.length} new items from a list of ${ data.length}`)
        this.fullList = getList();
        this.lastUpdate = Date.now();
    }

    // returns items by id
    get (id) {
        return new Promise((resolve, reject) => {
            db.get( createId(itemId), (err, value) => {
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
            db.createReadStream(options)
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
    create (itemId, item) {
        return db.put( createId(itemId), JSON.stringify(item));
    }  

    // reutrns a string ID with proper prefix
    createId = async (id) => {
        return `${ itemId } ${ this.dbprefix }`
    } 
}

module.exports = data;