const {default: axios} = require('axios');
const {v4: uuidv4} = require('uuid');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const fs = require("fs")
const solanaWeb3 = require('@solana/web3.js');
const crypto = require('crypto');

// This test submits linktrees from differnet publicKey to the service and stored in localdb
async function main() {
try {
  const { publicKey: publicKeyraw, secretKey: secretKey } = solanaWeb3.Keypair.generate();
  // const {publicKey, secretKey} = nacl.sign.keyPair.fromSecretKey(
  //   new Uint8Array(JSON.parse(fs.readFileSync("./test_wallet.json", 'utf-8')))
  // );
  const publicKey = publicKeyraw.toBase58();
  console.log('publicKey', publicKey);
  const payload = {
    data: {
      uuid: uuidv4(),
      linktree: [
        {
          key: 'official',
          label: 'Official Website',
          redirectUrl: 'https://spheron.network/',
        },
        {
          key: 'twitter',
          label: 'Twitter',
          redirectUrl: 'https://twitter.com/blockchainbalak',
        },
        {
          key: 'github',
          label: 'GitHub',
          redirectUrl: 'https://github.com/spheronFdn/',
        },
      ],
      timestamp: Date.now(),
    },
    publicKey: publicKey,
  };

  // Check payload
  // console.log(payload);
  
  await axios
    .post('http://localhost:8080/task/7jP87G1LJzWmLrr6RqQcA8bH6spZven4RHxGCgbPFzSo/linktree', {payload})
    .then((e) => {
      if (e.status != 200) {
        console.log(e);
      }
      console.log(e.data);
    })
    .catch((e) => {
      console.error(e);
    });
} catch (e) {
    console.error(e)
}
}

main();

module.exports = main;