const levelup = require('levelup');
const leveldown = require('leveldown');
const { namespaceWrapper } = require('./namespaceWrapper');
const fs = require('fs');

// db functions for linktree
const getLinktree = async (publicKey) => {
  return new Promise((resolve, reject) => {
  namespaceWrapper.levelDB.get(getLinktreeId(publicKey), (err, value) => {
    if (err) {
      console.error('Error in getLinktree:', err);
      resolve(null);
    } else {
      resolve(JSON.parse(value || '[]'));
    }
    });
  });
}

const setLinktree = async (publicKey, linktree) => {
   namespaceWrapper.levelDB.put(getLinktreeId(publicKey), JSON.stringify(linktree));
   return console.log('Linktree set');
}

const getAllLinktrees = async (values) => {
  return new Promise((resolve, reject) => {
  let dataStore = [];

  if (!values) values = true;
  namespaceWrapper.levelDB.createReadStream({
      lt: 'linktree~',
      gt: `linktree`,
      reverse: true,
      keys: true,
      values: values
  })
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

// namespaceWrapper.levelDB functions for proofs
const getProofs = async (pubkey) => {
  return new Promise((resolve, reject) => {
    namespaceWrapper.levelDB.get(getProofsId(pubkey), (err, value) => {
      if (err) {
        console.error('Error in getProofs:', err);
        resolve(null);
      } else {
        resolve(JSON.parse(value || '[]'));
      }
      });
    });
}

const setProofs = async (pubkey, proofs) => {
    namespaceWrapper.levelDB.put(getProofsId(pubkey), JSON.stringify(proofs));
    return console.log('Proofs set');
}

const getAllProofs = async () => {
  return new Promise((resolve, reject) => {
    let dataStore = [];
    namespaceWrapper.levelDB.createReadStream({
      gte: 'proofs',
      reverse: true,
      keys: true,
      values: true
    })
      .on('data', function (data) {
        console.log( data.key.toString(), '=', data.value.toString())
        dataStore.push( JSON.parse(data.value.toString()));
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
    namespaceWrapper.levelDB.get(getNodeProofCidid(round), (err, value) => {
      if (err) {
        console.error('Error in getNodeProofCid:', err);
        resolve(null);
      } else {
        resolve(value.toString() || '[]');
      }
      });
    });
}

const setNodeProofCid = async (round, cid) => {
    namespaceWrapper.levelDB.put(getNodeProofCidid(round), cid);
    return console.log('Node CID set');
}

const getAllNodeProofCids = async () => {
  return new Promise((resolve, reject) => {
    let dataStore = [];
    const nodeProofsStream = namespaceWrapper.levelDB.createReadStream({
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

//db functions fro Auth list
const getAuthList = async (pubkey) => {
  return new Promise((resolve, reject) => {
    namespaceWrapper.levelDB.get(getAuthListId(pubkey), (err, value) => {
      if (err) {
        console.error('Error in getAuthList:', err);
        resolve(null);
      } else {
        resolve(JSON.parse(value || '[]'));
      }
      });
    });
}

const setAuthList = async (pubkey) => {
    namespaceWrapper.levelDB.put(getAuthListId(pubkey), JSON.stringify(pubkey));
    return console.log('Auth List set');
}

const getAllAuthLists = async (values) => {
  if (!values) values = true;
  return new Promise((resolve, reject) => {
    let dataStore = [];
    const authListStream = namespaceWrapper.levelDB.createReadStream({
      gt: 'auth_list:',
      lt: 'auth_list~',
      reverse: true,
      keys: true,
      values: values
  })
    authListStream
      .on('data', function (data) {
        console.log( data.key.toString(), '=', data.value.toString())
        dataStore.push( JSON.parse(data.value.toString()) );
      })
      .on('error', function (err) {
        console.log('Something went wrong in read authListStream!', err);
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

const getAuthListId = (round) => {
  return `auth_list:${round}`;
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
  getAllNodeProofCids,
  getAuthList,
  setAuthList,
  getAllAuthLists,
  getAuthListId
}