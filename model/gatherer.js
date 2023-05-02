// The Gatherer class provides a generic manager for a search and its results. It is designed to be used by the system/controller.js class. It is responsible for managing the search queue, saving the search and its results to the database, and requires an adapter.

// The adapter must be specified on creation of the gatherer, and must implement the following methods:
// 1. negotiateSession() - negotiates a session with the API
// 2. checkSession() - checks if the session is valid
// 3. newSearch(query) - fetches a new search from the API
// 4. parseOne(item) - parses a single item from the API into a format that can be used by the rest of the system
// 5. parseList(list) - parses a list of items from the API into a format that can be used by the rest of the system

// The gatherer must be instantiated with options.query which can be a list of keywords or a more custom filter object for the specific adapter in use

const Adapter = require('./adapter');
const Data = require('./data');
const Search = require('./search');
const Twitter = require('../adapters/twitter');

class Gatherer {
    constructor(db, adapter, options ) {
        console.log('creating new adapter', db.db, adapter, options)
        this.db = db;
        this.maxRetry = options.maxRetry;
        this.options = options;
        this.adapter = adapter;
        this.pending = [];
    }

    gather = async (limit) => {

        // I. Startup
        // 1. Fetch an initial list of items using the query provided
        let startupList = await this.adapter.newSearch(this.options.query);
        let startupItems = await this.adapter.storeListAsPendingItems(startupList); 
        
        // 2. Save the items to the database with the 'pending' prefix
        // 3. Fetch the next page of items using the query provided
        
        // the following flags are for debug use only
            let exit = false; 
            let blue = true;
            
        while (blue) {
            let nextPage = await this.adapter.getNextPage();
            if (nextPage) {

                if (this.options.nextLimit) {
                    if (nextPage.length > this.options.nextLimit) {
                        nextPage = nextPage.slice(0, this.options.nextLimit);
                        exit = true;
                    }
                }
                let nextItems = await this.adapter.storeListAsPendingItems(nextPage);
            } else {
                break;
            }
            if (exit) {
                break;
            }
            blue = false;
        }


        // II . Main Loop
            // 4. If no next page exists, or the options.nextLimit flag is used, use the list of items to find a second tier of items that are connected to each item found in the first list
            // 5. Save the second tier of items to the database with the 'pending' prefix
            // 6. Fetch the next page of items using the query provided
            // 7. Repeat steps 4-6 until the limit is reached or there are no more pages to fetch

            let red = true;
            while (red) {
                this.pending = await this.db.getPending(this.options.limit);

                try {
                    if (this.pending.length > 0) {
                        this.queue.push(this.task_queue.run(() =>
                            this.addBatch()
                            .catch((e) => console.error(e))
                        ))

                        await Promise.allSettled(this.queue)  // TODO fix batching as this will only resolve once all queued items have run, while we want to refill the batch as it is emptied 
                    } else {
                        console.log('queue empty')
                        break;
                    }
                } catch (err) {
                    console.error('error processing a node', err)
                    break;
                }
                red = false;
            }
        
        

        // III. Diagnostics 
            // 8. Return live asynchronous updates of the items being saved to the database

        // IV. Auditing and Proofs
            // 9. Incrementally upload new items to IPFS and save the IPFS hash to the database (i.e. db.put('ipfs:' + item.id + ':data, ipfsHash)) for use in the rest apis
            // 10. Any time an item is saved to the database, check if it is a duplicate of an item already in the database. If it is a duplicate, delete the item from the database and return the id of the duplicate item instead (check for item updates)
            // 11. Sign all IPFS payloads and save the signature to the database (i.e. db.put('ipfs:' + item.id + ':signature', ipfsHash)) for use in the rest apis
    }

    addBatch = async function () {
        for (let i = 0; i < this.batchSize; i++ ) {
            await this.processPending ()
        }
    }

    processPending = async function ( ) {
        // get a random node from the pending list
        let item = this.adapter.getNextPendingItem();
        if (item) {
            this.adapter.parseOne(item) // this function should take care of removing the old pending item and adding new pending items for the list from this item
        }

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