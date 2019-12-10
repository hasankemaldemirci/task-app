const app = require('./app')
const port = process.env.PORT

app.listen(port, () => console.log(`App is listening on port ${port}!`))