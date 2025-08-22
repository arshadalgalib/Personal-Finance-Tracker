const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs'); 

const app = express();
const db = new Database('database.db'); 

// Create tables if not exist 
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    description TEXT,
    amount REAL,
    type TEXT
  );
`);

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs'); 
app.use(session({
  secret: 'simple-secret', 
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if logged in
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Middleware to check if admin
async function isAdmin(req, res, next) {
  if (req.session.username === 'admin') {
    next();
  } else {
    res.redirect('/dashboard');
  }
}

// Home page (GET)
app.get('/', (req, res) => {
  res.render('home', { currentPage: 'home', isLoggedIn: !!req.session.userId });
});

// Login page (GET)
app.get('/login', (req, res) => {
  res.render('login', { currentPage: 'login', isLoggedIn: !!req.session.userId });
});

// Login handle (POST)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  } else {
    res.render('login', { currentPage: 'login', isLoggedIn: false }); 
  }
});

// Register page (GET)
app.get('/register', (req, res) => {
  res.render('register', { currentPage: 'register', isLoggedIn: !!req.session.userId });
});

// Register handle (POST)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10); 
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);
    res.redirect('/login');
  } catch {
    res.render('register', { currentPage: 'register', isLoggedIn: false });
  }
});

// Dashboard (GET, logged in)
app.get('/dashboard', isLoggedIn, (req, res) => {
  const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 5').all(req.session.userId);
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });
  const balance = income - expense;
  res.render('dashboard', { income, expense, balance, transactions, username: req.session.username, currentPage: 'dashboard', isLoggedIn: true });
});

// Transactions list (GET, logged in)
app.get('/transactions', isLoggedIn, (req, res) => {
  const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ?').all(req.session.userId);
  res.render('transactions', { transactions, currentPage: 'transactions', isLoggedIn: true });
});

// Add transaction page (GET, logged in)
app.get('/add', isLoggedIn, (req, res) => {
  res.render('add', { currentPage: 'add', isLoggedIn: true });
});

// Add handle (POST)
app.post('/add', isLoggedIn, (req, res) => {
  const { date, description, amount, type } = req.body;
  db.prepare('INSERT INTO transactions (user_id, date, description, amount, type) VALUES (?, ?, ?, ?, ?)').run(
    req.session.userId, date, description, parseFloat(amount), type
  );
  res.redirect('/transactions');
});

// Edit page (GET, dynamic routing)
app.get('/edit/:id', isLoggedIn, (req, res) => {
  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (transaction) {
    res.render('edit', { transaction, currentPage: 'edit', isLoggedIn: true });
  } else {
    res.redirect('/transactions');
  }
});

// Edit handle (POST)
app.post('/edit/:id', isLoggedIn, (req, res) => {
  const { date, description, amount, type } = req.body;
  db.prepare('UPDATE transactions SET date = ?, description = ?, amount = ?, type = ? WHERE id = ? AND user_id = ?').run(
    date, description, parseFloat(amount), type, req.params.id, req.session.userId
  );
  res.redirect('/transactions');
});

// Delete (POST, from list)
app.post('/delete/:id', isLoggedIn, (req, res) => {
  db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  res.redirect('/transactions');
});

// Admin page (GET, admin only)
app.get('/admin', isLoggedIn, isAdmin, (req, res) => {
  const users = db.prepare('SELECT id, username FROM users').all();
  const summaries = users.map(user => {
    const trans = db.prepare('SELECT * FROM transactions WHERE user_id = ?').all(user.id);
    let income = 0, expense = 0;
    trans.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { username: user.username, balance: income - expense };
  });
  res.render('admin', { summaries, currentPage: 'admin', isLoggedIn: true });
});

// Logout (GET)
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
