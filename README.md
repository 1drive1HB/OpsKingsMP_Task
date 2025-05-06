# 🌦️ OPSKINGS Weather Report Emailer

A CLI-based Node.js tool that sends HTML weather reports via Gmail,
using either test data or live API data.

---

## ⚙️ Quick Setup

### Requirements

* Node.js v14+
* Gmail App Password
* `.env` config (see example below)

### Install

```bash
git clone https://github.com/1drive1HB/OpsKingsMP_Task
cd OpsKingsMP_Task
npm install
```

---

## 🖥️ Run the CLI

```bash
node src/cli.js
```

### Menu Options

```
❯ Send Test Email (with Test Data)
  Send Prod Email (live API Data)
  Exit
```

---

## ✉️ Email Modes

### 🧪 Test Email

* Uses: `src/test/public_holidays.json` & `src/test/weather_stats.json`
* Env: `RECIPENT_TEST_STATIC_EMAIL`
* Sends to test recipient with mock data.

### 🚀 Production Email

* Fetches: Live data from Weather & Holidays APIs
* Env: `RECIPIENT_EMAIL`
* Sends to configured prod email (e.g., `david@opskings.com`)

---

## 📂 Project Structure

```
src/
├── cli.js
├── email_template.html
├── services/      # API & email logic
├── utils/         # Helper functions
├── test/          # Sample JSON data
```

---

## 🌐 APIs Used

* [Weather API](https://hook.eu2.make.com/7mfiayunbpfef8qlnielxli5ptoktz02)
* [Public Holidays API](https://hook.eu2.make.com/76g53ebwgbestjsj1ikejbaicpnc5jro)

---

## 📤 Email Setup

### Example `.env`

```env
RECIPIENT_EMAIL=david@opskings.com
RECIPENT_TEST_STATIC_EMAIL=test@example.com

WEATHER_API=...
HOLIDAYS_API=...

SENDER_EMAIL_SUBJECT=Weather Report System
EMAIL_SERVICE=GMAIL
APP_PASSWORD_GMAIL=your_app_password
```

▶️ [How to generate a Gmail App Password](https://www.youtube.com/watch?v=MkLX85XU5rU)

---

## 🧠 How It Works

1. CLI prompts user for email type
2. Fetches data (API or test files)
3. Processes stats (temp, weather, holidays)
4. Builds an HTML report
5. Sends via `nodemailer` with `weather_stats.json` attached

---

## 📦 Dependencies

| Package      | Description                         |
| ------------ | ----------------------------------- |
| `axios`      | API requests to external services   |
| `nodemailer` | Gmail integration for email sending |
| `inquirer`   | Interactive CLI prompts             |
| `dotenv`     | Load `.env` configuration           |

## 👨‍💻 Author

**MP** — Built with ❤️ in 2025
[GitHub](https://github.com/your-username)

---
