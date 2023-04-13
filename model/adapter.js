/**
 * @fileoverview Adapter class for the API
 * @author
 * @license MIT
 * @version 0.0.1
 * @module model/adapter
 * @requires axios
 * @requires model/search
 * @requires model/data
 * @requires model/gatherer
 * @requires model/processor
 * @requires model/transformer
 * @requires model/validator
 * @requires model/visualizer
 * @requires model/scraper
 *      
 * @description
 * 
 * The Adapter class is the main class for the API. It is responsible for
 * 1. authenticating with the API
 * 2. fetching data from the API
 * 3. parsing the data into a format that can be used by the rest of the system
 * 4. passing the data to the rest of the system
 * 
 * The Adapter class is designed to be extended by other classes that implement the methods
 * for authenticating with the API and fetching data from the API. The Adapter class is
 * designed to be used by the system/controller.js class.
 * 
 */

const axios = require('axios');

class Adapter {
    constructor(credentials, maxRetry, shims) {
        this.credentials = credentials
        
        for (const shimName in shims) {
            this[shimName] = shims[shimName];
        }
        this.maxRetry = maxRetry || 3; // the max retry on session auth - recommended to keep this low to avoid IP lockouts

    }

    negotiateSession = async () => {
        // negotiate session with the API using credentials provided
        //  i.e. 
        let result = axios.post('https://api.example.com/login', {
            username: this.credentials.username,
            password: this.credentials.password
        })
        this.session = result.session;
        this.checkSession();
    }

    checkSession = async () => {

        // check if the session is valid
        // i.e.
        let result = axios.post('https://api.example.com/checkSession', {
            session: this.session
        })
        if (result.status == 200) {

            this.session = result.session;
            this.session.isValid = true;

        } else {
            // session is invalid
            this.session = null;
            this.session.isValid = false;
            this.negotiateSession();
        }
        
    }

    // default methods can be overriden by passing shims[methods]
    newSearch = async (query) => {
        if (!this.session || !this.session.isValid) 
        return new Search(query);

    }
    
    parseOne = async (search) => {
        // fetch the next item in the search queue
        // i.e.
        let result = axios.post('https://api.example.com/search', {
            session: this.session,
            query: search.query,
            offset: search.offset
        })
        if (result.length > 0) {
            search.offset = search.offset + result.length;
            return result[0];
        } else {        
            return null;
        }

    }

    parseMany = async (search, totalNumber, batchsize, delay) => {
        if (!delay) delay = 0;
        if (!totalNumber) {
            // run until the search runs out
            // dispatch the parseOne function in batches of a fixed size with a delay between batches

            let result = [];

            // loop over the search queue in batches of batchsize
            // i.e.
            for (let i = 0; i < search.length; i += batchsize) {
                let item = await this.parseOne(search);
                result.push(item);
                // TODO sleep is undefined  
                await sleep(delay);
            }
            
        } else {
            // run until number of items are fetched
        }

    }


    

}

class Search {
    constructor(query) {
        console.log(query)
        this.offset = 0;
    }
    setQuery(query) { 
    }
    setOffset(offset) {
        this.offset = offset;
    }
    getNext() {
        // TODO
    }

    
}

module.exports = Adapter;
