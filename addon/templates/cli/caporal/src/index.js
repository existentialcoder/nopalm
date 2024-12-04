#!/usr/bin/env node

const { program } = require('@caporal/core');

program
  .version('1.0.0')
  .description('A simple CLI application to greet users')
  .command('greet', 'Greet a user')
  .argument('<name>', 'Name of the user')
  .action(({ logger, args }) => {
    logger.info(`Hello, ${args.name}!`);
  })
  .command('help', 'Show help information')
  .action(({ logger }) => {
    logger.info(`Usage: greet [options]
Options:
  greet <name>   Specify the name to greet
  help           Show help information
  version        Show version information`);
  })
  .command('version', 'Show version information')
  .action(({ logger }) => {
    logger.info(`greet version 1.0.0`);
  });

program.run();
