const dataFromCid = require("../helpers/dataFromCid");

async function mergedData() {
  // Write the logic to fetch the submission values here and return the cid string

  // fetching round number to store work accordingly

  console.log('***********IN FETCH SUBMISSION**************');
  // The code below shows how you can fetch your stored value from level DB
  let cid = 'bafybeiawmee7fohpdm7po7txii22pawjvzy374fhppdruvcckjowxs74ay';
  console.log('Linktree CID', cid);

  // fetch the cid data from IPFS
  const outputraw = await dataFromCid(cid);
  const output = outputraw.data;
  const linktrees_list_object = output.data;
  console.log('RESPONSE DATA', linktrees_list_object);

  // compare the linktrees_list_object with the data stored in levelDB
  const linktrees_list_object_local = [{
    data: {
      uuid: '202400b2-7c8f-420d-8215-7cf0e53dfd76',
      linktree: [
        {
          key: 'New data',
          label: 'New data',
          redirectUrl: 'New data',
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
      timestamp: 1680805628220,
    },
    publicKey: '7Se5mr1WyfzvXvNPu4f8Ck8WxeByACX3pfuxGQsMgsz5',
    signature:
      '5LQ8NBP9SFy2N9ePdkUrfqR1P6cyqLP2HjCDxcxYQN9ZxAdNQuH43oQ1MH3HtiDKMUKmqkNkZunkRHkLfg8VJVoZ',
  },
  {data: {
    uuid: '202400b2-7c8f-420d-8215-7cf0e53dfd76',
    linktree: [
      {
        key: 'New data',
        label: 'New data',
        redirectUrl: 'New data',
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
    timestamp: 1680805628220,
  },
  publicKey: 'newpublickey',
  signature:
    '5LQ8NBP9SFy2N9ePdkUrfqR1P6cyqLP2HjCDxcxYQN9ZxAdNQuH43oQ1MH3HtiDKMUKmqkNkZunkRHkLfg8VJVoZ',
}];

  // if the same key is present in both the objects, the value from the first object will be taken
  const mergedData = [];

  linktrees_list_object.forEach((itemCID) => {
    // Check if an item with the same publicKey exists in linktrees_list_object_local
    const matchingItemIndex = linktrees_list_object_local.findIndex((itemLocal) => itemLocal.publicKey === itemCID.publicKey);
    if (matchingItemIndex >= 0) {
      // If a matching item is found, compare timestamps
      const matchingItemLocal = linktrees_list_object_local[matchingItemIndex];
      if (matchingItemLocal.data.timestamp > itemCID.data.timestamp) {
        mergedData.push(matchingItemLocal);
        // Remove the matching item from linktrees_list_object_local
        linktrees_list_object_local.splice(matchingItemIndex, 1);
      } else {
        mergedData.push(itemCID);
      }
    } else {
      mergedData.push(itemCID);
    }
  });
  
  mergedData.push(...linktrees_list_object_local);

  console.log('mergedData', mergedData);
  console.log('mergedData', mergedData[0].data.linktree);
}

mergedData();
