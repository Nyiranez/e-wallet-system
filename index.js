const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000 || process.env.PORT;
const jsonParser = bodyParser.json()

const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('database.db'), {fileMustExist: true});

app.get('/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json({message: "Success", data: users});
})


app.post('/register', jsonParser, (req, res) => {
    console.log(req.body)

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

    const stmt = db.prepare('INSERT INTO users (fname, lname, email, password) VALUES (@fname, @lname, @email, @password)');
    const info = stmt.run({fname: fname, lname: lname, email: email, password: password});
    const user_id = info.lastInsertRowid

    const stmt2 = db.prepare('INSERT INTO accounts (amount, user_id) VALUES (@amount, @user_id)');
    const info2 = stmt2.run({amount: 1000, user_id: user_id});

    let message = 'Creating account failed';
  
    if (info.changes && info2.changes) {
        message = 'Account created successfully';
    }

    res.json({message: message});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});




// const result = db.exec(`
//         CREATE TABLE accounts (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         amount INTEGER NOT NULL,
//         user_id INTEGER NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
//       );
//     `)