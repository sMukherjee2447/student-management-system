const express = require('express')
const req = require('express/lib/request')
const app = express()
const port = 3000

app.set('view engine','ejs')

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})