let superagent = require('superagent')

let superagentdelays = {
    hc : {
        response: 1000,
        deadline: 2000
    }, 
    txfetch : {
        response: 2000,
        deadline: 10000
    },
    peers : {
        response: 2000,
        deadline: 10000
    }
}


class Peer {
    constructor (location) {
        this.location = location;
        this.isHealthy = false; 
        this.containsTx = false;
        this.peers = [];
    }
    healthCheck = async function () {
        // console.log('entered healthcheck')
        if (this.location.length > 100) {
            console.error('location field is too large')
            return
        }
        try {
            // console.log('sending health check for ', this.location)
            const payload = await superagent.get(`${this.location}/info`).timeout({
                response: superagentdelays.hc.response,  
                deadline: superagentdelays.hc.deadline, 
              })
            // console.log('payload received', payload)
            if (payload.text) {
              this.isHealthy = true;
            } 
            // console.log('healthcheck completed')
        } catch (err) {

            // console.error ("can't fetch " + this.location, err)
        }
        return
    }

    // FullScan
    // performs a full scan on a node
    // node: a crawler object must be passed in to allow new peers to be added
    fullScan = async function (txId) {
        // console.log('checking ' + this.location)
        if ( !this.isHealthy ) await this.healthCheck ();
        
        // console.log('moved past')
        if ( this.isHealthy ) {
            // console.log('getting peers for ' + this.location)
            await this.getPeers ()

            // console.log('checking tx for ' + this.location)
            await this.checkTx (txId)
        }

        // console.log(this.peers)

        return this
    } 

    // CheckTx
    // Checks if a specific node has a given txId
    checkTx = async function ( txId ) {
        if ( !this.isHealthy ) await this.healthCheck ();
        
        if ( this.isHealthy ) {
            try {
                // console.log('sending txid check for ', peerUrl)
                const payload = await superagent.get(`${this.location}/${ txId }`).timeout({
                    response: superagentdelays.txfetch.response,  
                    deadline: superagentdelays.txfetch.deadline, 
                  })
                // console.log('payload returned from ' + peerUrl, payload)
                const body = JSON.parse(payload.text);
                if (body) {
                  this.containsTx = true;
                } 

              } catch (err) {
                // if (debug) console.error ("can't fetch " + this.location, err)
              }
        }
        return this
    }

    // getPeers
    // Checks peers endpoint
    getPeers = async function (  ) {
        if ( !this.isHealthy ) await this.healthCheck ();

        // console.log('trying to get peers')
        if ( this.isHealthy ) {
            // console.log('passed healthcheck in getPeers')
            try {
                // console.log('sending PEER check for ', this.location)
                const payload = await superagent.get(`${this.location}/peers`).timeout({
                    response: superagentdelays.peers.response,  
                    deadline: superagentdelays.peers.deadline, 
                  })
                // console.log('payload returned from ' + this.location, payload)
                const body = JSON.parse(payload.text);
                // console.log("BODY", body)
                if (body) {
                  this.peers = body;
                } 
                return

            } catch (err) {
                console.error ("can't fetch peers from " + this.location, err)
            }
        }
        return
    }
}

module.exports = Peer;