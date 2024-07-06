const express = require('express');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

// Dodaj CORS middleware
app.use(cors());

// Podesi konekciju sa bazom podataka
const sequelize = new Sequelize('todo_app', 'stanko', 'stanko98', {
    host: 'localhost',
    dialect: 'mariadb'
  });
  
// Proveri konekciju
sequelize.authenticate()
.then(() => console.log('Connected to the database.'))
.catch(err => console.error('Unable to connect to the database:', err));
    
// Sinhronizacija baze podataka sa definisanim modelima
sequelize.sync().then(() => {
    console.log('Database synchronized.');
  }).catch(err => {
    console.error('Error synchronizing the database:', err);
  });

// Definisanje modela Todo
const Todo = sequelize.define('todos', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

// Dodavanje rute za čitanje svih Todo stavki
// app.get('/API/todos', async (req, res) => {
//     try {
//       const todos = await Todo.findAll();
//       res.status(200).json(todos);
//     } catch (err) {
//       console.error('Error fetching todos:', err);
//       res.status(500).json({ error: 'Error fetching todos' });
//     }
//   });



const { QueryTypes } = require('sequelize');



app.get('/API/todos', async (req, res) => {
  try {
    const todos = await sequelize.query('SELECT * FROM todos AS todo', {
      type: QueryTypes.SELECT
    });
    console.log(todos);
    res.status(200).json(todos); // Slanje rezultata kao JSON odgovor na GET zahtev
  } catch (err) {
    console.error('Error executing raw SQL query:', err);
    res.status(500).json({ error: 'Error executing raw SQL query' }); // Slanje greške kao JSON odgovor na GET zahtev
  }
});








const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
