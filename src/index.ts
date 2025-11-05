const express = require('express')
const app = express()
const port = 3000

app.get('/', (req: any, res: any) => {
    let helloMessage = 'Incubator1!';
    res.send(helloMessage)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
