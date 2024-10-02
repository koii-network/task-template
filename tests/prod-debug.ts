import { spawn } from "cross-spawn";
import fs from "fs";
import Debugger from "./debugger";
import { Tail } from "tail";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startWatching(): void {
  console.log("Watching for file changes...");
  // watch and trigger builds
  build();
}

/* build and webpack the task */
function build(): void {
  console.log("Building...");
  const child = spawn("npm", ["run", "webpack:test"], {
    stdio: "inherit",
  });

  child.on("close", (code: number) => {
    if (code !== 0) {
      console.error("Build failed");
    } else {
      console.log("Build successful");
      copyWebpackedFile();
    }
    return;
  });
}

/* copy the task to the Desktop Node runtime folder */
async function copyWebpackedFile(): Promise<void> {
  const debugConfig = await Debugger.getConfig();
  console.log("debugConfig", debugConfig);
  const nodeDIR = debugConfig.nodeDir;
  const sourcePath = path.join(__dirname, debugConfig.webpackedFilePath);
  const desktopNodeExecutablePath = path.join(
    nodeDIR,
    debugConfig.destinationPath,
  );
  const desktopNodeLogPath = path.join(nodeDIR, debugConfig.logPath);
  const keywords = debugConfig.keywords;
  const taskID = debugConfig.taskID;

  if (!sourcePath || !desktopNodeExecutablePath) {
    console.error("Source path or destination path not specified in .env");
    return;
  }

  console.log(
    `Copying webpacked file from ${sourcePath} to ${desktopNodeExecutablePath}...`,
  );

  fs.copyFile(sourcePath, desktopNodeExecutablePath, async (err) => {
    if (err) {
      console.error("Error copying file:", err);
    } else {
      console.log("File copied successfully");
      tailLogs(desktopNodeLogPath, keywords, taskID);
    }
  });
}

/* tail logs */
async function tailLogs(
  desktopNodeLogPath: string,
  keywords: string[],
  taskID: string,
): Promise<void> {
  console.log("Watching logs for messages containing ", keywords);

  // Extract the directory path from the full log file path
  const dirPath = path.dirname(desktopNodeLogPath);

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
    await fs.promises.access(desktopNodeLogPath, fs.constants.F_OK);
  } catch (err) {
    console.log(`Log file not found, creating ${desktopNodeLogPath}`);
    await fs.promises.writeFile(desktopNodeLogPath, "", { flag: "a" }); // 'a' flag ensures the file is created if it doesn't exist and not overwritten if it exists
  }

  let tail = new Tail(desktopNodeLogPath, {
    separator: "\n",
    flushAtEOF: true,
  });

  console.warn(
    `Now watching logs for messages containing ${keywords.join(",")}. Please start the task ${taskID} and keep it running on the Desktop Node.`,
  );

  tail.on("line", (data: string) => {
    if (keywords.some((keyword) => data.includes(keyword))) {
      console.log(chalk.magenta(data));
    } else {
      console.log(data);
    }
  });

  +tail.on("error", (error: Error) => {
    console.log("ERROR: ", error);
  });
}

startWatching();
