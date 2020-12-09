const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
let users = []
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//get all users
app.get("/user", (req, res) => {
    res.status(200).json({
        users
    })
})

//create user data
app.post("/user", async(req, res) => {
    try {
        //hashed password asynchronously
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
//login with user data
app.post("/user/login", async(req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if (user == null) {
        return res.status(404).send("can't find any users related")
    }
    try {
        //compare password asynchronously
        if (await bcrypt.compare(req.body.password, user.password)) {
            return res.send("Success Login")
        } else {
            return res.send('Not Allowed')
        }
    } catch {
        return res.statusCode(404)
    }
})

//server running or localhost:2001
app.listen(2001)
