const { namespaceWrapper } = require("./namespaceWrapper");
const dataFromCid = require("./helpers/dataFromCid");
const getKeys = require("./helpers/getKey");
const hashCompare = require("./helpers/hashCompare");

module.exports = async (submission_value) => {
  const linktreeIndex = submission_value;
  console.log("linktreeINDEX", linktreeIndex);

  try {
    const output = await dataFromCid(linktreeIndex);
    console.log("RESPONSE DATA", output.data);
    const linktreeIndexData = output.data.data;
    console.log("linktree INDEX DATA", linktreeIndexData);
    const signature = output.data.signature;
    console.log("SIGNATURES", signature);
    const publicKey = output.data.pubKey;
    console.log("PUBKEY", publicKey);

    if (!output.data || !signature || !publicKey) {
      console.error("No data received from web3.storage");
      return false;
    }

    // verifying the signature and getting the original data
    const check = await hashCompare(linktreeIndexData, signature, publicKey);
    console.log("CHECK", check);

    if (check == true) {
      console.log("IN IF");
      const values = Object.values(linktreeIndexData);
      const keys = Object.keys(linktreeIndexData);
      const size = values.length;

      const testlinktree_string = await namespaceWrapper.storeGet("testlinktree");
      let testlinktree = JSON.parse(testlinktree_string);
      console.log("Getting Linktree list", testlinktree);
      if (!testlinktree) {
        console.log("NEW Linktree LIST MADE");
        testlinktree = {};
      }

      let apiResponse = await dataFromCid(values[i]);
      console.log("OUTPUT FROM INDEX CID", apiResponse.data);
      if (apiResponse == false) {
        return false;
      }
      let userIndexData = apiResponse.data.data;
      let index = Object.values(userIndexData);
      console.log("INDEX", index[0]);

      // checking the Linktree owner sigature now : P

      const index_length = Object.keys(index[0]).length;
      console.log("INDEX LENGTH", index_length);
      const latest_state = await getKeys(index[0], index_length);
      console.log("LATEST STATE", latest_state);

      let output = await dataFromCid(latest_state);
      console.log("OUTPUT FROM LATEST STATE", output.data);
      if (output == false) {
        return false;
      }
      console.log("RESPONSE DATA", output.data);
      //   const Pd = JSON.stringify(output.data);
      const signedMessage = output.data.signedMessage;
      console.log("SIGNED MESSAGE", signedMessage);
      const publicKey = output.data.pubKey;
      console.log("PUBLIC KEY", publicKey);

      if (!signedMessage || !publicKey) {
        console.error("Signature or public Key missing from userIndex");
        return false;
      }

      // verifying the signature and getting the original data

      const verifiedPayload = await namespaceWrapper.verifySignature(
        signedMessage,
        publicKey
      );
      if (verifiedPayload.error) {
        return false;
      } else {
        //const verifiedPayload = JSON.parse(verifiedPayloadString);
        console.log("Original Data", verifiedPayload);

        const userIndexData = verifiedPayload.data;
        const parsed = JSON.parse(userIndexData);
        console.log("USER INDEX DATA", parsed);
        const originalLinktree = parsed.data;
        console.log("ORIGINAL Linktree", originalLinktree);
        const userSignature = parsed.keys.signedMessage;
        console.log("SIGNATURES", userSignature);
        const userPublicKey = parsed.keys.pubkey;
        console.log("PUBKEY", userPublicKey);

        if (!userIndexData || !userSignature || !userPublicKey) {
          console.error("No data received from web3.storage");
          return false;
        }

        const check_data = await hashCompare(
          originalLinktree,
          userSignature,
          userPublicKey
        );
        if (check_data == true) {
          console.log("CHECK PASSED");
          // Add the Linktree to local node

          // storing linktree Index

          try {
            await namespaceWrapper.storeSet(
              "linktreeIndex" + `${Linktree}`,
              values[i]
            );
          } catch (err) {
            console.log("ERROR IN STORING Linktree", err);
            res.status(404).json({ message: "ERROR in storing Linktree" });
          }

          // storing the Linktree in testlinktree

          testlinktree[Linktree] = "no";
          let testlinktree_string = JSON.stringify(testlinktree);
          console.log("ADDED Linktree LIST", testlinktree_string);
          await namespaceWrapper.storeSet("testlinktree", testlinktree_string);

          //storting the user Index

          let cid_index_stingified = JSON.stringify(index[0]);
          console.log("USER_INDEX STRINGIFIED ", cid_index_stingified);
          await namespaceWrapper.storeSet(Linktree, cid_index_stingified);

          // check the user index store

          try {
            const cid_index = await namespaceWrapper.storeGet(Linktree);
            console.log("Getting cid index", cid_index);
          } catch (err) {
            console.log("CATCH IN GET", err);
          }
        } else {
          return false;
        }
      }
      return true;
    } else {
      console.log("IN ELSE");
      return false;
    }
  } catch (error) {
    console.log("ERROR", error);
  }

  //return true;
};

