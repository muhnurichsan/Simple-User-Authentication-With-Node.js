const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
let users = []
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//all users
app.get("/user", (req, res) => {
    res.status(200).json({
        users
    })
})

app.post("/user", async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            username: req.body.username,
            password: hashedPassword
        }
        users.push(user)
        res.json(user)
    } catch {
        res.sendStatus(500)
    }
})
app.post("/user/login", async(req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if (user == null) {
        return res.status(404).send("can't find any users related")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            return res.send("Success Login")
        } else {
            return res.send('Not Allowed')
        }
    } catch {
        return res.statusCode(404)
    }
})
app.listen(2001)