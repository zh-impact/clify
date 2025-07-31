import fs from "node:fs";

export function isFile(filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isFile();
}

export function readFile(filepath: string) {
  return fs.readFileSync(filepath, "utf-8");
}
