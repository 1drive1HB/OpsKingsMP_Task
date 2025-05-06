# OpsKingsMP_Task - docs for solution  task

A CLI-based Node.js tool that sends HTML weather reports via Gmail,
using either test data or live API data.


OpsKingsMP_Task/
│
├── .env
├── package.json
├── package-lock.json
├── README.md
├── node_modules/         
├── dev/                  
└── src/                  
    ├── cliMenu.js        
    ├── services/         
    │   ├── api.js
    │   └── email.js
    ├── test/             
    │   ├── public_holidays.json
    │   └── weather_stats.json
    └── utils/            
        └── helper.js


dependencies | Package      | Description                         |
| ------------ | ----------------------------------- |
| `axios`      | API requests to external services   |
| `nodemailer` | Gmail integration for email sending |
| `inquirer`   | Interactive CLI prompts             |
| `dotenv`     | Load `.env` configuration           |