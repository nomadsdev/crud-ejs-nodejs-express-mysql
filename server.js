const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_ejs'
});

db.connect((err) => {
    if (err) {
      console.error('Error connection to database', err);
    } else {
      console.log('Connected to database');
    }
  });

app.get('/', (req, res) => {
    db.query('SELECT * FROM employees', (err, result) => {
      if (err) throw err;
      res.render('index', { data: result });
    });
});
  
app.post('/add', (req, res) => {
    const { name, occupation, salary } = req.body;
    const query = 'INSERT INTO employees (name, occupation, salary) VALUES (?, ?, ?)';
    db.query(query, [name, occupation, salary], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
});
  
  app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM employees WHERE id = ?', [id], (err, result) => {
      if (err) throw err;
      res.render('edit', { data: result[0] });
    });
});
  
app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name, occupation, salary } = req.body;
    const query = 'UPDATE employees SET name=?, occupation=?, salary=? WHERE id=?';
    db.query(query, [name, occupation, salary, id], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
});
  
  app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('Server is running');
});