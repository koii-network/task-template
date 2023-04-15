const Adapter = require('./adapter');
const Data = require('./data');
const Search = require('./search');

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
        // authenticate with the adapter
        let session = this.adapter.negotiateSession();

        // generate a new search
        let search = new Search(this.options.startQuery, this.options, this.adapter);
        
        // parse items and crawl links for more items
        let items = this.search.getList();

        // save items to the db
        for (const item of items) {

            this.db.create(items);

        }

        // save search to the db
        this.db.create(search);

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