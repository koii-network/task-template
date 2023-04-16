// The Gatherer class provides a generic manager for a search and its results. It is designed to be used by the system/controller.js class. It is responsible for managing the search queue, saving the search and its results to the database, and requires an adapter.

// The adapter must be specified on creation of the gatherer, and must implement the following methods:
// 1. negotiateSession() - negotiates a session with the API
// 2. checkSession() - checks if the session is valid
// 3. newSearch(query) - fetches a new search from the API
// 4. parseOne(item) - parses a single item from the API into a format that can be used by the rest of the system
// 5. parseList(list) - parses a list of items from the API into a format that can be used by the rest of the system

const Adapter = require('./adapter');
const Data = require('./data');
const Search = require('./search');
const Twitter = require('../adapters/twitter');

class Gatherer {
    constructor(db, adapter, maxRetry, startQuery, maxdepth, maxItems, maxItemsPerList, maxLists) {
        this.db = db;
        this.maxRetry = maxRetry;
        this.options = {
            startQuery : startQuery,
            maxdepth : maxdepth,
            maxItems : maxItems, 
            maxItemsPerList : maxItemsPerList,
            maxLists : maxLists
        }
        this.adapter = adapter;
    }

    gather = async (limit) => {
        if ( !limit ) limit = 10;
        let allItems = []; // this contains the records found

        // set up an adapter
        // authenticate with the adapter
        let session = this.adapter.negotiateSession();

        // generate a new search
        let search = new Search(this.options.startQuery, this.options, this.adapter);
        
        // parse items and crawl links for more items
        let items = this.search.getList();

        // save items to the db
        for (const item of items) {
            if ( allItems.length < limit) {
                let newId = this.db.create(items);
                allItems[newId] = item;
            } else {
                return allItems;
            }

        }

        // TODO - save search to the db
        // this.db.create(search);

        return allItems; // catch all in case for loops break

    }

    // TODO - fix the methods below with proper db prefix mgmt
    // TODO then integrate them into the above flows to allow async queueing of reads from APIs and writes to the db
    getData(id) {
        return this.db.get(id);
    }
    getList (options) {
        return this.db.getList(options);
    }

}

module.exports = Gatherer;