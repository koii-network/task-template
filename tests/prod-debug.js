import { spawn } from "cross-spawn";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { Tail } from "tail";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { TEST_KEYWORDS, WEBPACKED_FILE_PATH, TASK_ID } from "./config.js";
import { getFileCIDs, getNodeDirectory } from "./utils/index.js";

const nodeDir = await getNodeDirectory();
const { executable, metadata } = await getFileCIDs();

const metadataPath = path.join(nodeDir, "metadata/", `${metadata}.json`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const startWatching = async () => {
  console.log("Watching for file changes...");
  // watch and trigger builds
  await build();
};

/* build and webpack the task */
const build = async () => {
  console.log("Building...");
  const child = await spawn("npm", ["run", "webpack:test"], {
    stdio: "inherit",
  });

  await child.on("close", (code) => {
    if (code !== 0) {
      console.error("Build failed");
    } else {
      console.log("Build successful");
      startProdDebug();
    }
    return;
  });
};

/* copy the task to the Desktop Node runtime folder */
const startProdDebug = async () => {
  // Copy the webpacked file to the Desktop Node
  const sourcePath = path.join(__dirname, WEBPACKED_FILE_PATH);
  const executablePath = path.join(nodeDir, "executables/", `${executable}.js`);

  if (!sourcePath || !executablePath) {
    console.error("Source path or destination path not specified in .env");
    return;
  }

  console.log(
    `Copying webpacked file from ${sourcePath} to ${executablePath}...`,
  );

  fs.copyFile(sourcePath, executablePath, async (err) => {
    if (err) {
      console.error("Error copying file:", err);
    } else {
      console.log("Executable file copied successfully");
    }
  });

  // Set the prod-debug flag in the metadata file
  fs.readFile(metadataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData["prod-debug"] = true;

      fs.writeFile(
        metadataPath,
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (writeErr) => {
          if (writeErr) {
            throw writeErr;
          }

          console.log("Metadata file updated successfully");
        },
      );
    } catch (err) {
      console.error("Error setting prod-debug flag:", parseErr);
      return;
    }
  });
  tailLogs();
};

/* tail logs */
const tailLogs = async () => {
  console.log("Watching logs for messages containing ", TEST_KEYWORDS);
  const logPath = path.join(nodeDir, "namespace/", TASK_ID, "task.log");
  // Extract the directory path from the full log file path
  const dirPath = path.dirname(logPath);

  // Check if the directory exists, create it if it doesn't
  try {
    await fs.promises.access(dirPath, fs.constants.F_OK);
  } catch (dirErr) {
    console.log(
      "Unable to find task directory. Please make sure you have the correct task ID set in your .env file, and run the task on the Desktop Node before running prod-debug.",
    );
    process.exit(1);
  }

  // Ensure the log file exists, or create it if it doesn't
  try {
    await fs.promises.access(logPath, fs.constants.F_OK);
  } catch (err) {
    console.log(`Log file not found, creating ${logPath}`);
    await fs.promises.writeFile(logPath, "", { flag: "a" }); // 'a' flag ensures the file is created if it doesn't exist and not overwritten if it exists
  }

  let tail = new Tail(logPath, "\n", {}, true);

  console.log(
    `Now watching logs for messages containing ${TEST_KEYWORDS.join(", ")}. Please start the task ${TASK_ID} and keep it running on the Desktop Node.`,
  );

  tail.on("line", function (data) {
    if (keywords.some((keyword) => keyword && data.includes(keyword))) {
      console.log(chalk.magenta(data));
    } else {
      console.log(data);
    }
  });

  tail.on("error", function (error) {
    console.log("ERROR: ", error);
  });
};

startWatching();
