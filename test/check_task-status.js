const { Connection, PublicKey } = require('@_koi/web3.js');
async function main() {
  const connection = new Connection('https://k2-devnet.koii.live');
  const accountInfo = await connection.getAccountInfo(
    new PublicKey('HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP'),
  );
  console.log(JSON.parse(accountInfo.data+''));
}

main();