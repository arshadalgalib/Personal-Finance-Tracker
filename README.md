# Finance Tracker

A web-based personal finance management application for developers and startups to track income and expenses efficiently. Built with HTML, CSS, Bootstrap, EJS, Node.js, Express.js, and SQLite, with WordPress integration support.

![Finance Tracker Screenshot](https://github.com/arshadalgalib/Personal-Finance-Tracker/blob/main/images/Homepage.png)

## Features

- **Home Page**: Welcome message, feature highlights, and register/login links.
- **Login/Register**: Secure user authentication with username and password.
- **Dashboard**: Displays total income, expenses, balance, progress bar, and recent transactions.
- **Transactions**: Lists all user transactions with date, description, amount, and type.
- **Add Transaction**: Form to add new income or expense entries.
- **Edit Transaction**: Update existing transaction details.
- **Admin Panel**: Admin-only view of all users' financial summaries.
- **Responsive Design**: Bootstrap-powered UI with navbar and mobile support.
- **WordPress Integration**: Embed via iFrame or link for seamless integration.

## Run Instructions (Linux Mint)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. **Install Node.js and npm**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

3. **Install Dependencies**:
   ```bash
   npm install express ejs better-sqlite3 express-session bcrypt
   ```

4. **Set Up SQLite Database**:
   - The `database.db` file is created automatically on first run.
   - No additional setup required.

5. **Run the Application**:
   ```bash
   npm start
   ```
   - Access at `http://localhost:3000`.

6. **Test Credentials**:
   - Admin: Username: `admin`, Password: `123`
   - Or register a new user.

     ```

## Notes

- Requires Node.js v16+ and npm.
- Uses SQLite; no external database setup needed.
- Stop the server with `Ctrl+C`.
