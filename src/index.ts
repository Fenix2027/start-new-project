import {app} from "./app";


const port = 3000
export const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
