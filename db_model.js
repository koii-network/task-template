const levelup = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown(__dirname + 'localKOIIDB'));

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
  const linktreesStream = db.createReadStream({
    lt: 'proofs:\xff',
    reverse: true,
    keys: true,
    values: true
})
  .on('data', function (data) {
    console.log( data.key.toString(), '=', data.value.toString())
  })
  .on('error', function (err) {
    console.log('Something went wrong in read linktreesStream!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    console.log('Stream ended')
  })
  
  return linktreesStream;
}

// db functions for proofs
const getProofs = async (round) => {
  return new Promise((resolve, reject) => {
    db.get(getProofsId(publicKey), (err, value) => {
      if (err) {
        console.error("Error in getProofs:", err);
        resolve(null);
      } else {
        resolve(JSON.parse(value || "[]"));
      }
      });
    });
}

const setProofs = async (round, proofs) => {
    db.put(getProofsId(round), JSON.stringify(proofs));
    return console.log("Proofs set");
}

const getAllProofs = async () => {
  const proofsStream = db.createReadStream({
    lt: 'proofs:\xff',
    reverse: true,
    keys: true,
    values: true
})
  .on('data', function (data) {
  console.log( data.key.toString(), '=', data.value.toString())
  })
  .on('error', function (err) {
  console.log('Something went wrong in read proofsStream!', err)
  })
  .on('close', function () {
  console.log('Stream closed')
  })
  .on('end', function () {
  console.log('Stream ended')
  })

  return proofsStream;
}

// db functions for node proofs
const getNodeProofCid = async (round) => {
  return new Promise((resolve, reject) => {
    db.get(getNodeProofCidid(publicKey), (err, value) => {
      if (err) {
        console.error("Error in getNodeProofCid:", err);
        resolve(null);
      } else {
        resolve(JSON.parse(value || "[]"));
      }
      });
    });
}

const setNodeProofCid = async (round, cid) => {
    db.put(getNodeProofCidid(round), cid);
    return console.log("Node CID set");
}

const getAllNodeProofCids = async () => {
  const cidsStream = db.createReadStream({
    lt: 'node_proofs:\xff',
    reverse: true,
    keys: true,
    values: true
})
  .on('data', function (data) {
  console.log( data.key.toString(), '=', data.value.toString())
  })
  .on('error', function (err) {
  console.log('Something went wrong in read cidsStream', err)
  })
  .on('close', function () {
  console.log('Stream closed')
  })
  .on('end', function () {
  console.log('Stream ended')
  })

  return cidsStream;
}


const getNodeProofCidid = (round) => {
  return `node_proofs:${round}`;
}

const getLinktreeId = (publicKey) => {
  return `linktree:${publicKey}`;
}

const getProofsId = (round) => {
  return `proofs:${round}`;
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