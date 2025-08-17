# Personal Finance Tracker

## Overview
The **Personal Finance Tracker** is a full-stack web application designed to help users manage their personal finances by tracking income and expenses. It includes user authentication (login/register), an admin panel for user management, and profile editing capabilities for both users and admins. The app features a clean, responsive design with a consistent blue-green theme, built to meet academic project requirements for a lab final, including CRUD operations, dynamic routing, and secure authorization.

### Features
- **User Authentication**: Register and log in with a username and password (hashed with bcrypt).
- **Transaction Management**:
  - Create, read, update, and delete (CRUD) financial transactions (income/expense).
  - View transaction summaries (total income, expenses, balance).
- **Profile Editing**:
  - Users can update their username and password from the dashboard.
  - Admins can edit any user's username and password via the admin panel.
- **Admin Panel**: Admins can view all users, delete users, and edit user details.
- **Dynamic Routing**: Routes like `/edit/:id` (transactions) and `/edit-user/:id` (admin user edits) use dynamic parameters.
- **Responsive Design**: Consistent blue-green theme with CSS, mobile-friendly layout.
- **Pages**: Includes 7 pages (Login, Register, Dashboard, Add Transaction, Edit Transaction, Admin, Edit Profile, plus admin-only Edit User).

### Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite (lightweight, file-based)
- **Frontend**: EJS (server-side templating), HTML, CSS, minimal JavaScript
- **Security**: bcrypt for password hashing, express-session for session management
- **Dependencies**: Listed in `package.json` (express, sqlite3, bcryptjs, express-session, body-parser, ejs)

## Project Structure
```
finance-tracker/
├── app.js              # Main server file (Express routes, DB setup)
├── database.db         # SQLite database (auto-created)
├── package.json        # Project metadata and dependencies
├── public/
│   ├── styles.css      # CSS for consistent styling
│   └── script.js       # Client-side JS for delete confirmations
├── views/
│   ├── login.ejs       # Login page
│   ├── register.ejs    # Registration page
│   ├── dashboard.ejs   # Transaction list and summary
│   ├── add.ejs         # Add transaction form
│   ├── edit.ejs        # Edit transaction form (dynamic)
│   ├── admin.ejs       # Admin panel for user management
│   ├── edit-user.ejs   # Admin user edit form
│   └── edit-profile.ejs # User profile edit form
└── node_modules/       # Installed dependencies
```

## Setup Instructions

### Local Development
Follow these steps to run the app on your local machine.

#### Prerequisites
- **Node.js**: Install from [nodejs.org](https://nodejs.org) (LTS version, e.g., 16.x or 20.x).
- **Git**: To clone the repository.
- A code editor (e.g., VS Code).

#### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. **Install Dependencies**:
   Ensure `package.json` is present, then run:
   ```bash
   npm install
   ```
   This installs `express`, `sqlite3`, `bcryptjs`, `express-session`, `body-parser`, and `ejs`.

3. **Run the Application**:
   ```bash
   node app.js
   ```
   The server starts on `http://localhost:3000`. If port 3000 is in use, see Troubleshooting.

4. **Test the App**:
   - Open `http://localhost:3000` in a browser.
   - Register a new user or log in with the default admin account:
     - Username: `admin`
     - Password: `admin123`
   - Explore features: add/edit transactions, edit profile (Dashboard > Edit Profile), or manage users (Admin panel for admin users).

#### Troubleshooting Local Setup
- **Port Conflict (EADDRINUSE)**:
  - Check processes using port 3000:
    ```bash
    lsof -i :3000
    ```
  - Kill the process:
    ```bash
    kill -9 <PID>
    ```
  - Or change the port in `app.js` (e.g., `const port = 4000`) and access `http://localhost:4000`.
- **Missing Dependencies**:
  - If `npm install` fails, clear the npm cache:
    ```bash
    npm cache clean --force
    npm install
    ```
- **Database Issues**:
  - If `database.db` is corrupted, delete it and restart the app to recreate it.

### Deployment on CentOS Web Panel (CWP)
To deploy the app on a CWP server, follow these steps.

#### Prerequisites
- CWP server with root or user access (SSH enabled).
- A domain or subdomain linked to `/home/username/public_html`.
- Access to the CWP admin panel (e.g., `http://your-server-ip:2030`) or user panel (`http://your-server-ip:2083`).

#### Steps
1. **Install Node.js on CWP**:
   SSH into your server as root:
   ```bash
   ssh root@your-server-ip
   ```
   - Install development tools:
     ```bash
     yum groupinstall 'Development Tools' -y
     ```
   - Add NodeSource repository (e.g., for Node.js 16.x):
     ```bash
     curl -sL https://rpm.nodesource.com/setup_16.x | bash -
     ```
   - Install Node.js:
     ```bash
     yum install -y nodejs
     ```
   - Verify:
     ```bash
     node -v
     npm -v
     ```

2. **Upload Project Files**:
   - **Via CWP File Manager**:
     - Log in to the CWP user panel.
     - Go to **File Manager** > `public_html`.
     - Create a `finance-tracker` folder and upload all project files.
   - **Via SCP**:
     ```bash
     scp -r /local/path/to/finance-tracker username@your-server-ip:/home/username/public_html/
     ```
   - Verify files:
     ```bash
     ls -R /home/username/public_html/finance-tracker
     ```

3. **Install Dependencies**:
   Navigate to the project folder:
   ```bash
   cd /home/username/public_html/finance-tracker
   ```
   Install dependencies:
   ```bash
   npm install
   ```
   Fix permissions if needed:
   ```bash
   chown -R username:username /home/username/public_html/finance-tracker
   chmod -R 755 /home/username/public_html/finance-tracker
   ```

4. **Run the App with PM2**:
   Install PM2 to keep the app running:
   ```bash
   npm install -g pm2
   ```
   Start the app:
   ```bash
   pm2 start /home/username/public_html/finance-tracker/app.js --name finance-tracker
   ```
   Save the process:
   ```bash
   pm2 save
   ```
   Set up PM2 for server reboot:
   ```bash
   pm2 startup
   ```
   Follow the output instructions to enable startup.

5. **Configure Nginx in CWP**:
   - Log in to the CWP admin panel.
   - Go to **Webserver Settings** > **Webserver Domain Conf**.
   - Select the user and domain/subdomain (e.g., `finance.yourdomain.com`).
   - Choose **nginx -> custom port**, set:
     - IP: `127.0.0.1`
     - Port: `3000`
     - Check **Rebuild webserver conf for domain on save**.
   - Save changes.
   - Alternatively, edit the Nginx config manually:
     ```bash
     nano /etc/nginx/conf.d/username_yourdomain.com.conf
     ```
     Add:
     ```nginx
     location / {
         proxy_pass http://127.0.0.1:3000;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
     ```
     Test and restart Nginx:
     ```bash
     nginx -t
     systemctl restart nginx
     ```

6. **Open Firewall Ports** (if needed):
   If accessing directly on port 3000:
   ```bash
   firewall-cmd --add-port=3000/tcp --permanent
   firewall-cmd --reload
   ```

7. **Test the Deployment**:
   - Access `http://yourdomain.com` or `https://yourdomain.com` (if SSL is enabled).
   - Log in with `admin`/`admin123` or a registered user.
   - Test all features: transactions, profile editing, admin panel.

#### Troubleshooting Deployment
- **Port Conflict**:
  - Check port 3000:
    ```bash
    lsof -i :3000
    ```
    Kill conflicting process:
    ```bash
    kill -9 <PID>
    ```
  - Or change the port in `app.js` (e.g., `const port = 4000`) and update Nginx.
- **Nginx Errors**:
  - Check logs:
    ```bash
    cat /var/log/nginx/error.log
    ```
  - Verify config:
    ```bash
    nginx -t
    ```
- **PM2 Issues**:
  - Check app status:
    ```bash
    pm2 status
    ```
  - View logs:
    ```bash
    pm2 logs finance-tracker
    ```

## Usage
- **Register/Login**: Create a new account or use `admin`/`admin123` (default admin).
- **Dashboard**: View transactions, summary (income, expenses, balance), and edit profile.
- **Add/Edit/Delete Transactions**: Manage financial records via the dashboard.
- **Profile Editing**: Update username/password via Dashboard > Edit Profile.
- **Admin Panel**: Accessible to admins (`/admin`) to manage users (view, edit, delete).
- **Logout**: Ends the session and returns to the login page.

## Contributing
Contributions are welcome! Fork the repository, make changes, and submit a pull request. Ensure code follows the existing style and includes tests.

## License
This project is licensed under the MIT License.
