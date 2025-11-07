import express  from 'express'
import {runInNewContext} from "node:vm";
const app = express()
const port = 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
const http_statuses = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTED: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
}

const db = {
    courses: [ {id: 1, title: 'front-end'},
        {id: 2, title: 'beck-end'},
        {id: 3, title: 'automtion qa'},
        {id: 4, title: 'devops'}]
}

app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
      if(req.query.title) {
          foundCourses = foundCourses
              .filter(c => c.title.indexOf(req.query.title as string) > -1)
      }
    res.json(foundCourses)
})

app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(http_statuses.NOT_FOUND)
        return;
    }
    res.json(foundCourse)
})

app.post('/courses', (req, res) => {
    if (!req.body.title){
        res.sendStatus(http_statuses.BAD_REQUEST);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse)
    res
        .status(http_statuses.CREATED_201)
        .json(createdCourse)
})

app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    res.sendStatus(http_statuses.NO_CONTED)
})

app.put('/courses/:id', (req, res) => {
    if (!req.body.title){
        res.sendStatus(http_statuses.BAD_REQUEST);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(http_statuses.NOT_FOUND)
        return;
    }
    foundCourse.title = req.body.title
    res.sendStatus(http_statuses.NO_CONTED)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
