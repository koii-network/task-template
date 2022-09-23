/*
 * @description Gather BTC to USD prices
 */
const axios = require('axios');
const fs = require('fs');
const {Web3Storage, getFilesFromPath} = require('web3.storage');
const storageClient = new Web3Storage({token: process.env.WEB3_STORAGE_KEY});
async function task() {
  const promises = [];

  // https://www.coingecko.com/en/api/documentation
  promises.push(
    axios({
      method: 'get',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    })
      .then(async (response) => {
        if (response.data) {
          const price = response.data.bitcoin.usd;
          console.log('CoinGecko Price', price);
          return price;
        }
      })
      .catch((err) => {
        console.log('CoinGecko Failed: ', err.message);
      })
  );

  // https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesHistorical
  if (process.env.COINMARKETCAP_KEY) {
    promises.push(
      axios({
        method: 'get',
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10',
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY,
        },
      })
        .then(async (response) => {
          if (response.data) {
            const btc = response.data.data.find((e) => e.id == 1);
            if (btc) {
              const price = btc.quote.USD.price;
              console.log('CoinMarketCap Price', price);
              return price;
            }
          }
        })
        .catch((err) => {
          console.log('CoinMarketCap Failed: ', err.message);
        })
    );
  }

  // https://nomics.com/docs/
  if (process.env.NOMICS_KEY) {
    promises.push(
      axios({
        method: 'get',
        url: `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NOMICS_KEY}&ids=BTC&interval=1d`,
      })
        .then(async (response) => {
          if (response.data) {
            const price = response.data[0].price;
            console.log('Nomics Price', price);
            return price;
          }
        })
        .catch((err) => {
          console.log('Nomics Failed: ', err.message);
        })
    );
  }

  // https://docs.coinapi.io/?javascript#get-specific-rate-get
  if (process.env.COINAPI_KEY) {
    promises.push(
      axios({
        method: 'get',
        url: `https://rest.coinapi.io/v1/exchangerate/BTC/USD`,
        headers: {'X-CoinAPI-Key': process.env.COINAPI_KEY},
      })
        .then(async (response) => {
          if (response.data) {
            const price = response.data.rate;
            console.log('CoinAPI Price', price);
            return price;
          }
        })
        .catch((err) => {
          console.log('CoinAPI Failed: ', err.message);
        })
    );
  }

  const prices = (await Promise.all(promises)).filter((e) => e).map((e) => parseFloat(e));
  const avg_price = prices.reduce((a, b) => a + b) / prices.length;

  console.log('Prices', prices);
  console.log(`Avg Price: ${avg_price}`);
  const btc_price_json = JSON.stringify({avg_price, prices});
  fs.writeFileSync('btc_price.json', btc_price_json);

  if (storageClient) {
    // Storing on IPFS through web3 storage as example
    const file = await getFilesFromPath('./btc_price.json');
    const cid = await storageClient.put(file);
    console.log('Data uploaded to IPFS: ', cid);
    await namespace.redisSet('cid', cid);
    await namespace.checkSubmissionAndUpdateRound(cid);
  }
  return false;
}

module.exports = task;
