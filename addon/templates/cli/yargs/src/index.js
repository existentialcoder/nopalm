#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command('greet <name>', 'Greet a user', (yargs) => {
    yargs.positional('name', {
      describe: 'name to greet',
      type: 'string'
    });
  }, (argv) => {
    console.log(`Hello, ${argv.name}!`);
  })
  .help()
  .version('1.0.0')
  .argv;
