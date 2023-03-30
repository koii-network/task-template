const {default: axios} = require('axios');
const {v4: uuidv4} = require('uuid');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const fs = require("fs")
try {
  const {publicKey, secretKey} = nacl.sign.keyPair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync("./test_wallet.json", 'utf-8')))
  );
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
    publicKey: bs58.encode(publicKey),
  };
  const msg = new TextEncoder().encode(JSON.stringify(payload.data));
  payload.signature = bs58.encode(nacl.sign.detached(msg, secretKey));

  // Check payload
  console.log(payload);
  
  axios
    .post('http://localhost:8080/task/7jP87G1LJzWmLrr6RqQcA8bH6spZven4RHxGCgbPFzSo/register-linktree', {payload})
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