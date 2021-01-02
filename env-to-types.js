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

        -V, --version               Show the CLI Version
        -h, --help                  Show CLI usage information
        -o, --output-type           Output name/path for types files | default will be \`types.d.ts\`
      `
  );
  return process.exit(exitCode);
};
