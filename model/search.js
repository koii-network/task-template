
class Search {
    constructor(query, options, adapter) {
        console.log(query)
        this.query = query;
        this.options = options;
        this.options.offset = options.offset || 0;
        this.adapter = adapter; // holds the adapter object, including getList, parseOne
        this.list = []; // holds the list of items returned by the search
        this.lists = []; // holds the list of lists returned by the search
    }
    getList = async () => {
        
        let status = await this.adapter.checkSession()
        if (status == 200) {
            // session is valid
            // TODO - add logic to check if the search has already been run
            // if so, return the existing list
            // if not, run the search and return the list
            let result = await this.adapter.newSearch(this.query, this.options);
            this.list = result.list;
            this.lists = result.lists;
            return this.list;
        }


    }
    setOffset(offset) {
        // manages getting and setting the offset for the search queue
        this.options.offset = offset;
    }
    getNext() {
        // TODO - provides a basic iterator for the search queue
        // i.e.
        let minOffset = this.options.offsetSize || 0;
        if (minOffset == 0) { 
            return console.error('ERROR: Tried to trigger getNext() for a search, but no offsetSize provided."', `Query ${ this.query }`)
        } else {
            return new Search ( this.query, { offset: this.options.offset + minOffset }, this.adapter );
        }
            
    }

    
}

module.exports = Search;