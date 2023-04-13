class Gatherer {
    constructor(db) {
        this.db = db;
        
    }
    gather( ) {
        
    }
    getData(id) {
        return this.db.get(id);
    }
    getList (options) {
        return this.db.getList(options);
    }

}

module.exports = Gatherer;