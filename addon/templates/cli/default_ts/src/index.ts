#!/usr/bin/env node

// Define the version of the application
const version: string = '1.0.0';

// Get the command line arguments
const args: string[] = process.argv.slice(2);

// Helper function to display the help message
function showHelp(): void {
    console.log(`Usage: greet [options]
Options:
  --name <name>   Specify the name to greet
  --help          Show help information
  --version       Show version information`);
}

// Function to display the version
function showVersion(): void {
    console.log(`greet version ${version}`);
}

// Function to greet the user
function greetUser(name: string): void {
    console.log(`Hello, ${name}!`);
}

// Main function to parse and handle the arguments
function main(): void {
    if (args.length === 0 || args.includes('--help')) {
        showHelp();
        return;
    }

    if (args.includes('--version')) {
        showVersion();
        return;
    }

    const nameIndex: number = args.indexOf('--name');
    if (nameIndex !== -1 && args[nameIndex + 1]) {
        const name: string = args[nameIndex + 1];
        greetUser(name);
    } else {
        console.error('Error: Name not provided or invalid command.');
        showHelp();
    }
}

// Run the main function if the script is executed directly
if (require.main === module) {
    main();
}
