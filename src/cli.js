// cli.js
require('dotenv').config();
const inquirer = require('inquirer').default;
const { handleTestEmail, handleProductionEmail } = require('./services/email');

async function main() {
  try {
    // Interactive prompt
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Weather Report System:',
        choices: [
          { name: 'Send Test Email (with Test Data)', value: 'test' },
          { name: 'Send Prod Email (live API Data)', value: 'production' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    // Execute selected action
    switch (answers.action) {
      case 'test':
        await handleTestEmail();
        break;
      case 'production':
        await handleProductionEmail();
        break;
      case 'exit':
        process.exit(0); // Graceful exit
    }
  } catch (error) {
    console.error('❌ Error:', error.message); 
  } finally {
    // Auto-restart unless --no-loop flag is present
    if (process.argv[2] !== '--no-loop') {
      setTimeout(() => {
        console.clear(); // Reset console for clean UX
        main();
      }, 10000); // 10-second delay before restart - bolji UI
    }
  }
}

// main().catch(console.error);
// Start the application
main();