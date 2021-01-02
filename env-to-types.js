#!/usr/bin/env node
const pkg = require("./package.json");
const chalk = require("chalk");

const printVersion = () => console.log("v" + pkg.version);
const printHelp = (exitCode) => {
  console.log(
    chalk`{bleu env-to-types} - Start with a .env file and Generate a .d.ts file.
        {bold USAGE}

        {blue env-to-types} path/to/.env -> path to your .env file
    
        {bold OPTIONS}

        -v, --version               Show the CLI Version
        -h, --help                  Show CLI usage information
        -o, --output-type           Output name/path for types files | default will be \`types.d.ts\`
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
    ouputTypes: "env.d.ts",
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
          configCli.ouputTypes = outputTypes;
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

  if (!configCli.envPath && existsSync(joint(process.cwd(), ".env"))) {
    configCli.envPath = join(process.cwd(), ".env");
  }

  return configCli;
};
