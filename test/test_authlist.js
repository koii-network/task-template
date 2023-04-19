const {default: axios} = require('axios');

// This test submits linktrees from differnet publicKey to the service and stored in localdb
async function main() {
try {
  const pubkey = "testpubkeyregisterpubkey";
  const authdata = {pubkey}

  // Check payload
  // console.log(payload);
  
  await axios
    .post('http://localhost:10000/authlist', {authdata})
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
  catch (e) {
    console.error(e);
  }
}

main();

module.exports = main;