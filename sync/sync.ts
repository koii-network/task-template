import { removeTypes } from "babel-remove-types";
import fs from "fs/promises";
import fs2 from "fs";
import path from "path";

// Recursive function to process the directory
async function processDirectory(srcDir: string, outputDir: string) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relativePath = path.relative("./", srcPath);
    const outputPath = path.join(outputDir, relativePath);
    console.log(srcPath, relativePath, outputPath);
    if (entry.isDirectory() && !entry.name.endsWith('sync') && !entry.name.endsWith('.git') && !entry.name.endsWith('node_modules') && !entry.name.endsWith('dist') && !entry.name.endsWith('JSVersion')) {
      await fs.mkdir(outputPath, { recursive: true });
      await processDirectory(srcPath, outputDir);
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      const tsCode = await fs.readFile(srcPath, "utf8");
      const jsCode = await removeTypes(tsCode);
      const jsFileName = entry.name.replace('.ts', '.js');
      const jsPath = path.join(path.dirname(outputPath), jsFileName);
      
      await fs.writeFile(jsPath, jsCode);
      console.log(`${relativePath} synced`);
    } else if (entry.isFile() && !(entry.name.endsWith('package.json') || entry.name.endsWith('webpack.config.js') || entry.name.endsWith('.gitlab-ci.yml'))) {
      try{
        await fs2.copyFile(srcPath, outputPath, fs2.constants.COPYFILE_EXCL, (err) => {
          if (err) {
            console.error(`${relativePath} failed to sync`);
          } else {
            console.log(`${relativePath} synced`);
          }
        });
      } catch (e) {
        console.error(`${relativePath} failed to sync`);
      }
    } 
  }
}

async function main() {
  await processDirectory("./", "./JSVersion");
  // copy ./sync/rootFiles to ./JSVersion/
  await fs.cp("./sync/rootFiles", "./JSVersion", { recursive: true });
  // copy 
}

main().catch(console.error);