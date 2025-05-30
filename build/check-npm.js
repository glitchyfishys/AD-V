/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import proc from "child_process";
import readline from "readline";


function getHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    // Convert to 32bit integer
    hash &= hash;
  }
  return hash.toString();
}

console.log(import.meta.dirname)
const hashPath = path.resolve(import.meta.dirname, "../.tmp/package-lock.json.hash");
let currentHash = undefined;
if (fs.existsSync(hashPath)) {
  currentHash = fs.readFileSync(hashPath, { encoding: "utf-8" });
}

const packageLockPath = path.resolve(import.meta.dirname, "../package-lock.json");
const packageLockContents = fs.readFileSync(packageLockPath, { encoding: "utf-8" });
const newHash = getHash(packageLockContents);
if (newHash !== currentHash) {
  console.log('New Hash', newHash, currentHash);
  const tmpPath = path.resolve(import.meta.dirname, "../.tmp");
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("package-lock.json changes were detected");
  const timeout = setTimeout(() => {
    rl.close();
    console.log("Running 'npm ci' (this might take a while)...");
    proc.execSync("npm ci");
    fs.writeFileSync(hashPath, newHash, {});
  }, 5000);

  // eslint-disable-next-line max-len
  rl.question(`Press enter within the next five seconds to skip running 'npm ci' - this will leave your packages out of sync!`, () => {
    console.log(`'npm ci' step skipped`);
    rl.close();
    clearTimeout(timeout);
  });
}