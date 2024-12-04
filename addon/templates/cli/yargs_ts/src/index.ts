#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
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
