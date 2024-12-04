#!/usr/bin/env node

const { Command, flags } = require('@oclif/command');

class GreetCommand extends Command {
  async run() {
    const { flags } = this.parse(GreetCommand);
    const name = flags.name || 'world';
    this.log(`Hello, ${name}!`);
  }
}

GreetCommand.description = `Describe the command here
...
Extra documentation goes here
`;

GreetCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = GreetCommand;
