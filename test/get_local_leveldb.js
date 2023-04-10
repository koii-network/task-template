const { namespaceWrapper } = require("../namespaceWrapper");

async function getLocalLevelDB() {
  let linktrees_list_string;
  // await namespaceWrapper.storeSet("linktrees", []);
    linktrees_list_string = await namespaceWrapper.storeGet("linktrees");
    console.log("Linktrees list string", linktrees_list_string);

    Proof_list_string = await namespaceWrapper.storeGet("proofs");
    console.log("Proofs list string", Proof_list_string);
}

getLocalLevelDB();