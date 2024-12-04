#!/usr/bin/env node

// Define the version of the application
const version = '1.0.0';

// Get the command line arguments
const args = process.argv.slice(2);

// Helper function to display the help message
function showHelp() {
    console.log(`Usage: greet [options]
Options:
  --name <name>   Specify the name to greet
  --help          Show help information
  --version       Show version information`);
}

// Function to display the version
function showVersion() {
    console.log(`greet version ${version}`);
}

// Function to greet the user
function greetUser(name) {
    console.log(`Hello, ${name}!`);
}

// Main function to parse and handle the arguments
function main() {
    if (args.length === 0 || args.includes('--help')) {
        showHelp();
        return;
    }

    if (args.includes('--version')) {
        showVersion();
        return;
    }

    const nameIndex = args.indexOf('--name');
    if (nameIndex !== -1 && args[nameIndex + 1]) {
        const name = args[nameIndex + 1];
        greetUser(name);
    } else {
        console.error('Error: Name not provided or invalid command.');
        showHelp();
    }
}

// Export functions for testing
module.exports = { showHelp, showVersion, greetUser, main };

// Run the main function if the script is executed directly
if (require.main === module) {
    main();
}
