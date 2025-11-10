import express, {Request, Response}  from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";

export const app = express()
const port = 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
export const http_statuses = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTEND: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
}

type CourseType = {
    id: number
    title: string
}

const db : {courses: CourseType[]} = {
    courses: [ {id: 1, title: 'front-end'},
        {id: 2, title: 'beck-end'},
        {id: 3, title: 'automation qa'},
        {id: 4, title: 'devops'}]
}

app.get('/courses', (req: RequestWithQuery<{title: string}>,
res: Response<CourseType[]>) => {
    let foundCourses = db.courses;
      if(req.query.title) {
          foundCourses = foundCourses
              .filter(c => c.title.indexOf(req.query.title) > -1)
      }
    res.json(foundCourses)
})

app.get('/courses/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(http_statuses.NOT_FOUND)
        return;
    }
    res.json(foundCourse)
})

app.post('/courses', (req: RequestWithBody<{title: string}>,
                      res: Response<CourseType>) => {
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

app.delete('/courses/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    res.sendStatus(http_statuses.NO_CONTEND)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<{id:string},{title: string}>,
                         res: Response) => {
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
    res.sendStatus(http_statuses.NO_CONTEND)
})
app.delete('/__test__/data', (req: Request, res: Response) => {
    db.courses = [];

    res.sendStatus(http_statuses.NO_CONTEND)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
