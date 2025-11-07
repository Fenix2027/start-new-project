import express, {Request,Response} from 'express'
const app = express()
const port = 3000

app.get('/courses', (req: Request, res: Response) => {
  res.json([
      {id: 1, title:'front-end'},
      {id: 1, title:'beck-end'},
      {id: 1, title:'automtion qa'},
      {id: 1, title:'devops'}
  ])
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
