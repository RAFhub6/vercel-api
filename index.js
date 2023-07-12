// index.js
const express = require('express')
const api = require ('./api/index')

const app = express()
app.use(express.json())
const PORT = 4000
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})
app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})



// Export the Express API
module.exports = app
