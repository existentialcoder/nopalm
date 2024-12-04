#!/usr/bin/env node

const { Command } = require('commander');

const program = new Command();

program
  .version('1.0.0')
  .description('A simple CLI application to greet users');

program
  .command('greet <name>')
  .description('Greet a user')
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log(`Usage: greet [options]
Options:
  greet <name>   Specify the name to greet
  help           Show help information
  version        Show version information`);
  });

program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log('greet version 1.0.0');
  });

program.parse(process.argv);
