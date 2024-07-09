const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mariadb = require('mariadb');

const app = express();
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


app.use(cors());
app.use(bodyParser.json());

//Pravimo konekciju sa bazom
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'stanko',
  password: 'stanko98',
  database: 'todo_app',
  connectionLimit: 5
});

// Testiraj konekciju sa bazom
pool.getConnection()
  .then(conn => {
    console.log("Connected to MariaDB!");
    conn.release();
  })
  .catch(err => {
    console.log("Not connected due to error: " + err);
  });

// Dohvatamo elemente
app.get('/api/tasks', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const tasks = await conn.query('SELECT * FROM todos');
    conn.release();
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Dodavanje elemenata
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send('Title is required');
  }
  
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO `todos` (`id`, `title`, `completed`, `created_at`) VALUES (NULL, ?, 0, current_timestamp());', [title]);
    conn.release();
    res.status(201).send({ id: result.insertId, title });
  } catch (err) {
    res.status(500).send(err);
  }
});