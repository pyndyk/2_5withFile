'use strict'
const express = require('express')
const app = express()
const request = require('request')
const cors = require('cors')
const fs = require("fs");
const session = require("express-session")
const host = 'localhost'
const port = 3005
const corsConfig = {
    credentials: true,
    origin: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.static('public'))
app.options('*', cors());

app.use(express.json());
const FileStore = require('session-file-store')(session);
app.use(
    session({
        store: new FileStore({ retries: 0 }),
        secret: 'keyboard cat',
        resave: false,
        // name: 'session_id',
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: undefined,
            secure: false,
            sameSite: true,
        },
    })
);
// app.post('/api/v1/logIn', async function(req, res) {
//     try {
//         const { login: login, pass: pass } = req.body;
//         const db = JSON.parse(fs.readFileSync("items.json"))
//         const user = db.find(user => user.login == login && user.pass == pass)
//         if (user) {
//             req.session.id = user.id
//             return res
//                 .status(200)
//                 .send({ "ok": true })
//         }
//         return res.status(400).json({ "error": "user not found" })
//     } catch (e) {
//         return res.status(500).json({ "error": "server error" })
//     }
// })
// app.post('/api/v1/register', async function(req, res) {
//     try {
//         const { login: login, pass: pass } = req.body;
//         if (login && pass) {
//             const db = JSON.parse(fs.readFileSync("items.json"))
//             let number = JSON.parse(fs.readFileSync("id.json"))
//             const user = {
//                 id: (number + 1).toString(),
//                 login: login,
//                 pass: pass,
//                 items: []
//             }
//             db.push(user);
//             number++
//             //  req.session.userId = user.id
//             fs.writeFileSync("items.json", JSON.stringify(db))
//             fs.writeFileSync("id.json", JSON.stringify(number))
//             return res.status(200).json({ "ok": true })
//         }
//     } catch (e) {
//         console.log(e)
//     }
// })


app.get("/api/v1/items", async function(req, res) {
    console.log("M 1")
    const users = JSON.parse(fs.readFileSync("items.json"))

    res.body = users
    console.log(res.body)
    res.status(200)
});


app.post("/api/v1/items", async function(req, res) {
    console.log("M 2")
    try {
        let amountId = JSON.parse(fs.readFileSync("id.json"))
        let items = JSON.parse(fs.readFileSync("items.json"))
        amountId++;
        const newId = (Math.random());
        const item = {
            id: newId,
            items: req.body,
        }
        items.push({ id: amountId, item });
        fs.writeFileSync("items.json", JSON.stringify(items));
        fs.writeFileSync("id.json", JSON.stringify(amountId));
        return res
            .status(200)
            .json({
                id: amountId
            })
    } catch (e) {
        res.status(500).json(e)
    }
});


async function startApp() {
    try {
        app.listen(port, function() {
            return console.log("Server listens http://");
        });
    } catch (e) {}
}
startApp()