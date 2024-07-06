Napravi folder ToDoApp, zatim u njemu napravi foldere frontend i backend.
Prvo udji u backend folder, otvori terminal i kucaj

npm init -y - Ovo će kreirati package.json fajl sa podrazumevanim postavkama

zatim instaliraj express

npm install express

Napravi src folder gde će biti tvoj izvorni kod
Kreiraj index.js fajl unutar src foldera

Struktura treba da izgleda ovako:

backend/
├── node_modules/
├── src/
│   └── index.js
├── package.json
└── package-lock.json

Postavi osnovni Express server u index.js fajlu:

const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

U package.json nadji deo scripts, obicno izgleda ovako:

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1" 
  }

  i dodaj  "start": "node src/index.js"... da izgleda ovako:

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/index.js"
  }

Nakon toga idemo u frontend folder i kucamo  "npm create-react-app ." to ce napraviti react aplikaciju.
Pokreni react server sa "npm start"

I to je osnova za aplikaciju.

Sada cemo preci na bazu. /* Koristimo MariaDB (XAMPP) */

Prvo cemo anpratviti bazu todo_app
Izabracemo "utfmb4_unicode_ci"
Zatim cemo napraviti tabelu todos.

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Sada cemo povezati nasu aplikaciju sa bazom. Prvo sto cemo uraditi jeste instalacija paketa za mysql:

"npm install mysql2 sequelize mariadb" - ako javlja gresku instalirajte pakete posebno

[npm install mysql2]
[npm install sequelize]
[npm install mariadb]

Zatim na vrhu aplikacije dodajemo 

"const { Sequelize, DataTypes } = require('sequelize');"

// Podesi konekciju sa bazom podataka
const sequelize = new Sequelize('todo_app', 'root', 'password', {
  host: 'localhost',
  dialect: 'mariadb'
});

!!! Napomena: Zameni 'root', 'password', ime baze ('todo_app') sa stvarnim podacima za tvoj MariaDB server !!!

Zatim ispod dodaj:

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

Zatim dodajemo model Todo:

// Definisanje modela Todo
const Todo = sequelize.define('Todo', {
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

****************************************************************************************************************
****************************************************************************************************************
****************************************************************************************************************

Sada smo se povezali sa bazom i imamo model. Tvoj kod treba da izgleda ovako

const express = require('express');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');


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
const Todo = sequelize.define('Todo', {
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


const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

Proveri da li je sve u redu tako sto ces pokrenuti server
"node src/index.js"
Trebas da dobijes ovo:

[Server is running on port: 3001
Executing (default): SELECT 1+1 AS result
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'Todos' AND TABLE_SCHEMA = 'todo_app'
Connected to the database.
Executing (default): SHOW INDEX FROM `Todos`
Database synchronized.]

****************************************************************************************************************
****************************************************************************************************************
****************************************************************************************************************

Sada kada imamo sve sto je potrebno, mozemo poceti sa CRUD operacijama (Create, Read, Update, Delete)

