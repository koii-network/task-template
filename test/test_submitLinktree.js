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
  for (let i = 0; i < 5; i++) {
    console.log('i', i);
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
          key: 'linkedin',
          label: 'LinkedIn',
          redirectUrl: 'https://www.linkedin.com/in/prakarshpathak/',
        },
        {
          key: 'youtube',
          label: 'YouTube',
          redirectUrl: 'https://www.youtube.com/channel/UCIe3FlAWg06kGOrm1-c8oJg',
        },
        {
          key: 'discord',
          label: 'Discord',
          redirectUrl: 'https://discord.com/invite/ahxuCtm',
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
  const msg = new TextEncoder().encode(JSON.stringify(payload.data));
  payload.signature = bs58.encode(nacl.sign.detached(msg, secretKey));

  // Check payload
  console.log(payload);
  
  await axios
    .post('http://localhost:10000/register-linktree', {payload})
    .then((e) => {
      if (e.status != 200) {
        console.log(e);
      }
      console.log(e.data);
    })
    .catch((e) => {
      console.error(e);
    });
  }
} catch (e) {
    console.error(e)
}
}

main();

module.exports = main;