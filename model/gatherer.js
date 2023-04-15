const Adapter = require('./adapter');
const Data = require('./data');
const 

class Gatherer {
    constructor(db, dataSrc, credentials, maxRetry, shims, startQuery, maxdepth, maxItems, maxItemsPerList, maxLists) {
        this.db = db;
        this.credentials = credentials;
        this.maxRetry = maxRetry;
        this.adapter = new Adapter(credentials, maxRetry, shims);
        this.options = {
            startQuery : startQuery,
            maxdepth : maxdepth,
            maxItems : maxItems, 
            maxItemsPerList : maxItemsPerList,
            maxLists : maxLists
        }
    }

    gather( ) {
        // set up an adapter

        // generate a new search

        // parse items and crawl links for more items

    }
    getData(id) {
        return this.db.get(id);
    }
    getList (options) {
        return this.db.getList(options);
    }

}

module.exports = Gatherer;