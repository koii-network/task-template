const {default: axios} = require('axios');
const {v4: uuidv4} = require('uuid');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const fs = require('fs')
const solanaWeb3 = require('@solana/web3.js');
const crypto = require('crypto');

// This test submits linktrees from differnet publicKey to the service and stored in localdb
async function main() {
try {
  const keyPair = nacl.sign.keyPair();
  const publicKey = keyPair.publicKey;
  const privateKey = keyPair.secretKey;

  const data = {
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
  };

  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(data)),
  );
  const signedMessage = nacl.sign(messageUint8Array, privateKey);
  const signature = signedMessage.slice(0, nacl.sign.signatureLength);
  const payload = {
    data,
    publicKey: bs58.encode(publicKey),
    signature: bs58.encode(signature),
  };


  // Check payload
  // console.log(payload);
  
  await axios
    .post('https://k2-tasknet-ports-2.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree', {payload})
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