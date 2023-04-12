const levelup = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown(__dirname + '/localKOIIDB'));

// db functions for linktree
const getLinktree = async (publicKey) => {
  return new Promise((resolve, reject) => {
  db.get(getLinktreeId(publicKey), (err, value) => {
    if (err) {
      console.error("Error in getLinktree:", err);
      resolve(null);
    } else {
      resolve(JSON.parse(value || "[]"));
    }
    });
  });
}

const setLinktree = async (publicKey, linktree) => {
   db.put(getLinktreeId(publicKey), JSON.stringify(linktree));
   return console.log("Linktree set");
}

const getAllLinktrees = async () => {
  return new Promise((resolve, reject) => {
  let dataStore = [];
  const linktreesStream = db.createReadStream({
    lt: 'linktree~',
    reverse: true,
    keys: true,
    values: true
})
  linktreesStream
    .on('data', function (data) {
      console.log( data.key.toString(), '=', data.value.toString())
      dataStore.push({ key: data.key.toString(), value: JSON.parse(data.value.toString()) });
    })
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

// db functions for proofs
const getProofs = async (pubkey) => {
  return new Promise((resolve, reject) => {
    db.get(getProofsId(pubkey), (err, value) => {
      if (err) {
        console.error("Error in getProofs:", err);
        resolve(null);
      } else {
        resolve(JSON.parse(value || "[]"));
      }
      });
    });
}

const setProofs = async (pubkey, proofs) => {
    db.put(getProofsId(pubkey), JSON.stringify(proofs));
    return console.log("Proofs set");
}

const getAllProofs = async () => {
  return new Promise((resolve, reject) => {
    let dataStore = [];
    const proofsStream = db.createReadStream({
      gte: 'proofs',
      reverse: true,
      keys: true,
      values: true
  })
    proofsStream
      .on('data', function (data) {
        console.log( data.key.toString(), '=', data.value.toString())
        dataStore.push({ key: data.key.toString(), value: JSON.parse(data.value.toString())});
      })
      .on('error', function (err) {
        console.log('Something went wrong in read proofsStream!', err);
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

// db functions for node proofs
const getNodeProofCid = async (round) => {
  return new Promise((resolve, reject) => {
    db.get(getNodeProofCidid(round), (err, value) => {
      if (err) {
        console.error("Error in getNodeProofCid:", err);
        resolve(null);
      } else {
        resolve(value.toString() || "[]");
      }
      });
    });
}

const setNodeProofCid = async (round, cid) => {
    db.put(getNodeProofCidid(round), cid);
    return console.log("Node CID set");
}

const getAllNodeProofCids = async () => {
  return new Promise((resolve, reject) => {
    let dataStore = [];
    const nodeProofsStream = db.createReadStream({
      gt: 'node_proofs:',
      lt: 'node_proofs~',
      reverse: true,
      keys: true,
      values: true
  })
    nodeProofsStream
      .on('data', function (data) {
        console.log( data.key.toString(), '=', data.value.toString())
        dataStore.push({ key: data.key.toString(), value: data.value.toString() });
      })
      .on('error', function (err) {
        console.log('Something went wrong in read nodeProofsStream!', err);
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


const getNodeProofCidid = (round) => {
  return `node_proofs:${round}`;
}

const getLinktreeId = (publicKey) => {
  return `linktree:${publicKey}`;
}

const getProofsId = (pubkey) => {
  return `proofs:${pubkey}`;
}

module.exports = {
  getLinktree,
  setLinktree,
  getAllLinktrees,
  getProofs,
  setProofs,
  getAllProofs,
  getNodeProofCid,
  setNodeProofCid,
  getAllNodeProofCids
}