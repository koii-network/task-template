
class Search {
    constructor(query) {
        console.log(query)
        this.offset = 0;
        this.adapter = adapter; // holds the adapter object, including getList, parseOne
    }
    setQuery(query) { 
        // manages getting and setting the query for the search queue
        this.query = query;
    }
    setOffset(offset) {
        // manages getting and setting the offset for the search queue
        this.offset = offset;
    }
    getNext() {
        // TODO - provides a basic iterator for the search queue
    }

    
}

module.exports = Search;