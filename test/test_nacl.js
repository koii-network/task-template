// test nacl verified

const nacl = require('tweetnacl');
const bs58 = require('bs58');

async function test_main() {
    const submission_value = await generateAndSubmitDistributionList();
    await validate(submission_value);
}

async function generateAndSubmitDistributionList() {
    const keyPair = nacl.sign.keyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;
    
    const message = {     
            data: 'data',
            publicKey: '7AwybFMYogGa8LJ3n9i8QthUs6ybEcanC8UPejM76U7h',
            signature: 'P6McSGFMniTdaH5546b8b1xuL91UtjxS9RnXMxBcg8ewuvKuFwijqJHH9BSZnEnqs1niE1xx7DreRVCNqK4ZJSE'
    };
    const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(message)));
    
    const signedMessage = nacl.sign(messageUint8Array, privateKey);
    const signature = signedMessage.slice(0, nacl.sign.signatureLength);
    
    const submission_value = {
        data: message,
        publicKey: bs58.encode(publicKey),
        signature: bs58.encode(signature),
    }
    return submission_value
}

async function validate(submission_value) {
    const output = submission_value
    const message = output.data;
    console.log('RESPONSE DATA', message);
    const publicKey = output.publicKey;
    console.log('PUBLIC KEY', publicKey);
    const signature = output.signature;
    console.log('SIGNATURE', signature);
    const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(message)));
    const signatureUint8Array = bs58.decode(signature);
    const publicKeyUint8Array = bs58.decode(publicKey);

    const isSignatureValid = await verifySignature(messageUint8Array, signatureUint8Array, publicKeyUint8Array);
    console.log(`Is the signature valid? ${isSignatureValid}`);
}

async function verifySignature(message, signature, publicKey) {
    return nacl.sign.detached.verify(message, signature, publicKey);
}

test_main();

