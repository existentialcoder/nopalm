#!/usr/bin/env node

import { Command, flags } from '@oclif/command';

class GreetCommand extends Command {
  async run() {
    const { flags } = this.parse(GreetCommand);
    const name = flags.name || 'world';
    this.log(`Hello, ${name}!`);
  }
}

GreetCommand.description = 'Describe the command here';

GreetCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

export default GreetCommand;
