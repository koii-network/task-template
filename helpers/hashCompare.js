const crypto = require('crypto');
const { namespaceWrapper } = require('../namespaceWrapper');

module.exports = async (index, signature, publicKey) => {
  const hash = await namespaceWrapper.verifySignature(signature, publicKey);
  if (hash.error) {
    console.error('Could not verify the signatures');
  }

  console.log('DATA HASH', hash.data);

  // comparing the data Hash
  const expectedHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(index))
    .digest('hex');

  const expectedString = JSON.stringify(expectedHash);
  console.log('EXPECTED HASH', expectedString);

  if (hash.data == expectedString) {
    return true;
  } else {
    return false;
  }
};
