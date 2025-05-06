// cli.js
require('dotenv').config();
const inquirer = require('inquirer').default;
const { handleTestEmail, handleProductionEmail } = require('./services/email');

async function main() {
  try {
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

    switch (answers.action) {
      case 'test':
        await handleTestEmail();
        break;
      case 'production':
        await handleProductionEmail();
        break;
      case 'exit':
        process.exit(0); 
    }
  } catch (error) {
    console.error('❌ Error:', error.message); // add delay and clear Host
  }
}

main().catch(console.error);