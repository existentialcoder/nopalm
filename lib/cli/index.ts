#!/usr/bin/env node
import { Command } from 'commander';

import packageJson from '../../package.json' with { type: 'json' };

import start from '../index.js';

const program = new Command();

program
    .version(packageJson.version, '-v, --version', 'Display nopalm version')
    .description(packageJson.description);

program
    .command('help')
    .description('Display help')
    .action(() => {
        program.outputHelp();
    });

program
    .command('settings')
    .description('Manage Nopalm settings')
    .option('--get <key>', 'Get a setting value')
    .option('--set <key> <value>', 'Set a setting value')
    .action((options) => {
        if (options.get) {
            console.log(`Fetching value for setting: ${options.get}`);
        } else if (options.set) {
            console.log(`Setting ${options.set} to ${options.args[0]}`);
        } else {
            console.log('Use --get or --set with settings.');
        }
    });

program
    .command('start')
    .description('Start Nopalm server')
    .action(start);

program.parse(process.argv);
