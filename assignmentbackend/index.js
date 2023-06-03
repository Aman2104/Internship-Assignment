const mongoConnection = require('./db');
const express = require('express')
var cors = require('cors')

mongoConnection();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.use('/api', require('./routes/auth'))
app.use('/api/order', require('./routes/order'))

 
app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`)
})