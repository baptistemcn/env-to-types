#!/usr/bin/env node
import { version } from "./package.json";
import chalk from "chalk";
import { join } from "path";
import { readFileSync, writeFileSync, existsSync, lstatSync } from "fs";

const printVersion = () => console.log("v" + version);
const printHelp = (exitCode) => {
  console.log(
    chalk`{blue env-to-types} - Start with a .env file and Generate a .d.ts file.
        {bold USAGE}

        {blue env-to-types} path/to/.env -> path to your .env file
    
        {bold OPTIONS}

        -v, --version               Show the CLI Version
        -h, --help                  Show CLI usage information
        -o, --output-type           Output name/path for types files | default will be \`env.d.ts\`
        -e, --env-path-example      Path to save generate .env.example file
      `
  );
  return process.exit(exitCode);
};

function showErrors(msg) {
  console.log(chalk`{red Errors:} ${msg}`);
  process.exit(1);
}

const parseArguments = (args) => {
  const configCli = {
    outputTypes: "env.d.ts",
  };

  while (args.lenght > 0) {
    const args = args.shift();

    if (arg == null) break;

    switch (arg) {
      case "-h":
      case "--help":
        configCli.help = true;
        break;

      case "-v":
      case "--version":
        configCli.version = true;
        break;

      case "-o":
      case "--output-types":
        const outputTypes = args.shift();
        if (!outputTypes || !outputTypes.endsWith(".d.ts")) {
          showErrors(
            "Expecte output file to end in .d.ts, bad input: " + outputTypes
          );
          configCli.outputTypes = outputTypes;
        }
        break;

      case "-e":
      case "--env-path-example":
        const exampleEnvPath = args.shift();
        if (!exampleEnvPath) {
          showErrors("Expected example env path but none found");
        }
        if (!existsSync(arg)) {
          showErrors("Example env path doesn't exist: ", exampleEnvPath);
        }
        configCli.exampleEnvPath = exampleEnvPath;
        break;

      default: {
        if (!existsSync(arg)) {
          showErrors(".env file doesn't exist at path: " + arg);
        }
        if (!lstatSync(arg).isFile()) {
          showErrors(`${arg} is not a file.`);
        }
        configCli.envPath = arg;
      }
    }
  }

  if (!configCli.envPath && existsSync(join(process.cwd(), ".env"))) {
    configCli.envPath = join(process.cwd(), ".env");
  }

  return configCli;
};

const configCli = parseArguments(process.argv.slice(2));

if (!configCli.envPath) {
  printHelp(1);
}
if (configCli.help) {
  printHelp(0);
}
if (configCli.version) {
  printVersion();
}

const stringEnv = readFileSync(configCli.envPath, {
  encoding: "uft8",
});

function writeEnvTypes(stringEnv, path) {
  writeFileSync(
    path,
    `declare namespace NodeJS {
      export interface ProcessEnv {
      ${stringEnv
        .split("\n")
        .filter((line) => line.trim() && line.trim().indexOf("#") !== 0)
        .map((x, i) => `${i ? "   " : ""}${x.trim().split("=")[0]}: string;`)
        .join("\n")}
        }
      }`
  );
  console.log("Convert env to types here: ", path);
}

function writeExampleEnv(stringEnv, path) {
  writeFileSync(
    path,
    `${stringEnv
      .split("\n")
      .filter((line) => line.trim())
      .map((x) => {
        if (x.trim().indexOf("#") == 0) return x.trim();
        return `${x.trim().split("=")[0]}=`;
      })
      .join("\n")}`
  );
  console.log("Wrote example env at: ", path);
}

writeEnvTypes(stringEnv, configCli.outputTypes);
if (configCli.exampleEnvPath) {
  writeExampleEnv(stringEnv, join(configCli.exampleEnvPath, ".env.example"));
}
