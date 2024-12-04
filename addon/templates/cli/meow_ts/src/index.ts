#!/usr/bin/env node

import meow from 'meow';

const cli = meow(`
  Usage
    $ greet <name>
  
  Options
    --help       Show help information
    --version    Show version information

  Examples
    $ greet Alice
    Hello, Alice!
`, {
  flags: {
    help: {
      type: 'boolean',
    },
    version: {
      type: 'boolean',
    }
  }
});

const [input] = cli.input;

if (cli.flags.help) {
  cli.showHelp();
} else if (cli.flags.version) {
  cli.showVersion();
} else if (input) {
  console.log(`Hello, ${input}!`);
} else {
  cli.showHelp();
}
