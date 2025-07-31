import path from "node:path";

import { Command } from "commander";

import { extractTypes } from "./lib/extract-types";
import { isFile, readFile } from "./lib/file-utils";

if (process.argv.length < 3) {
  console.error("Usage: clify <filepath>");
  process.exit(1);
}

const filepath = process.argv[2]!;
const args = process.argv.slice(3);

if (import.meta.main) {
  const filenameWithoutExt = path.basename(filepath, path.extname(filepath));

  const command = new Command();

  const types = extractTypes(filepath);

  types.forEach((value, key) => {
    // console.log(key, value);

    const cmd = command.command(key);
    value.input?.forEach((input) => {
      cmd.option(`--${input.name} <${input.type}>`, input.type);
    });
    cmd.action((options) => {
      console.log("Command executed", key, options);
      const isFileExists = isFile(options.text);
      const content = readFile(options.text);
      const arg = isFileExists ? content : options.text;
      import(filepath).then((mod) => {
        console.log(mod[key](arg));
      });
    });
  });

  command.action(() => {
    console.log("Command executed main", filenameWithoutExt);
  });

  command.parseAsync(args, { from: "user" });
}
