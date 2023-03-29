const { Connection, PublicKey } = require('@_koi/web3.js');
async function main() {
  const connection = new Connection('https://k2-testnet.koii.live');
  const accountInfo = await connection.getAccountInfo(
    new PublicKey('7jP87G1LJzWmLrr6RqQcA8bH6spZven4RHxGCgbPFzSo'),
  );
  console.log(JSON.parse(accountInfo.data+""));
}

main();