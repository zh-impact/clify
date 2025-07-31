import { makeMainProgram, makeSubCommand } from "./cmd";
import { extractTypes } from "./lib/extract-types";

if (process.argv.length < 3) {
  console.error("Usage: clify <filepath>");
  process.exit(1);
}

const filepath = process.argv[2]!;
const args = process.argv.slice(3);

if (import.meta.main) {
  const types = extractTypes(filepath);

  const program = makeMainProgram(filepath, types.get("default"));

  types.has("default") && types.delete("default");

  if (types.size > 0) {
    makeSubCommand(filepath, program, types);
  }

  program.parseAsync(args, { from: "user" });
}
