import os from "os";
import path from "path";

let nodeDirectory;

export async function getNodeDirectory() {
  if (nodeDirectory) {
    return nodeDirectory;
  }
  const homeDirectory = os.homedir();

  switch (os.platform()) {
    case "linux":
      nodeDirectory = path.join(homeDirectory, ".config", "KOII-Desktop-Node");
      break;
    case "darwin":
      nodeDirectory = path.join(
        homeDirectory,
        "Library",
        "Application Support",
        "KOII-Desktop-Node",
      );
      break;
    default:
      // windows is the default
      nodeDirectory = path.join(
        homeDirectory,
        "AppData",
        "Roaming",
        "KOII-Desktop-Node",
      );
  }

  return nodeDirectory;
}
