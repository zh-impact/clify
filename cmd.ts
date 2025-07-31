import { Command } from "commander";

import { isFile, readFile } from "./lib/file-utils";

export type CmdArg = {
  input?: { name?: string; type?: string }[];
  output?: string | void;
};
export function makeMainProgram(filepath: string, arg?: CmdArg) {
  const program = new Command();
  const mainCmd = program.command("main");

  let mainAction: ((options: any) => void) | undefined;
  if (arg) {
    arg.input?.forEach((i) => {
      mainCmd.option(`-${i?.name?.[0]}, --${i?.name} <${i?.type}>`, i?.type);
    });

    mainAction = (options) => {
      // console.log("Command executed", options);

      const isFileExists = isFile(options.text);
      const content = isFileExists ? readFile(options.text) : options.text;

      import(`${process.cwd()}/${filepath}`).then((mod) => {
        if (typeof mod.default === "function") {
          const result = mod.default(content);
          if (arg?.output !== "void") {
            console.log(result);
          }
        } else {
          console.error("Default export is not a function");
        }
      });
    };
  } else {
    mainAction = (options) => {
      console.log("Default MainCommand executed", options);
    };
  }

  mainCmd.action(mainAction);

  return program;
}

export function makeSubCommand(filepath: string, main: Command, args?: Map<string, CmdArg>) {
  args?.forEach((value, key) => {
    const subCmd = new Command(key.slice(0, 4));

    value.input?.forEach((i) => {
      subCmd.option(`-${i?.name?.[0]}, --${i?.name} <${i?.type}>`, i?.type);
    });

    subCmd.action((options) => {
      // console.log("SubCommand executed", key, options);

      const isFileExists = isFile(options.text);
      const content = isFileExists ? readFile(options.text) : options.text;

      import(`${process.cwd()}/${filepath}`).then((mod) => {
        if (typeof mod[key] === "function") {
          const result = mod[key](content);
          if (value?.output !== "void") {
            console.log(result);
          }
        } else {
          console.error("SubCommand export is not a function");
        }
      });
    });

    main.addCommand(subCmd);
  });
}
