const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

// 解析表單提交的資料
app.use(express.json());

// 建立 MySQL 連線
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 資料庫使用者名稱
  password: '', // 資料庫密碼
  database: 'test_user' // 資料庫名稱
});

// 連線到 MySQL
connection.connect((err) => {
  if (err) { 
    console.error('Error inserting data into MySQL:', err);
    res.status(500).send('Internal Server Error');
  } else {
    console.log('Connected to MySQL');
  }
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'fake_fb.html'));
});

app.get('/show_information', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'show_information.html'));
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ users: results });
    }
  });
});

// 處理表單提交
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 建立參數化查詢
  const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
  const values = [email, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Data inserted into MySQL');
      res.send('Data inserted into MySQL');
    }
  });
});

// 監聽端口
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
