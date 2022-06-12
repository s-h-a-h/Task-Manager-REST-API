require('dotenv').config()
const app = require('./application')
const port = process.env.PORT_NUMBER

app.listen(port, () => {
    console.log('Server is running ' + port)
})