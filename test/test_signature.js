const nacl = require('tweetnacl');
const {namespaceWrapper} = require('../namespaceWrapper');

async function main() {
const keypair = await namespaceWrapper.getSubmitterAccount();

// Generate a signature
const message = 'Hello, Solana!';
const messageBuffer = Buffer.from(message, 'utf8');
const signature = nacl.sign.detached(messageBuffer, keypair.secretKey);

console.log('Signature:', Buffer.from(signature).toString('hex'));

// Verify the signature
const isValid = nacl.sign.detached.verify(messageBuffer, signature, keypair.publicKey);
console.log('Is the signature valid?', isValid);
}

main()