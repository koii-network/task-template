const { namespaceWrapper } = require("../namespaceWrapper");

async function getLocalLevelDB() {
const linktrees_list_string = await namespaceWrapper.storeGet("linktrees");
  console.log("Linktrees list string", linktrees_list_string);
}

getLocalLevelDB();