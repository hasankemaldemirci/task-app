const express = require('express')
const port = process.env.PORT
const app = express()

app.listen(port, () => console.log(`App is listening on port ${port}!`))