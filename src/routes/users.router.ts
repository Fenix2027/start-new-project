import express, {Express, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../modeis/QueryCoursesModel";
import {CourseViewModel} from "../modeis/CourseViewModel";
import {URIParamsCourseIdModel} from "../modeis/URIParamsCourseIdModel";
import {CreateCourseModel} from "../modeis/CreateCourseModel";
import {UpdateCourseModel} from "../modeis/UpdateCourseModel";
import {CourseType, DBtype} from "../db/db";


export const getCourseviewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}
export const http_statuses = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTEND: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
}



export const getUsersRouter = (db: DBtype) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryCoursesModel>,
                                   res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;
        if(req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title) > -1)
        }
        res.json(foundCourses.map(getCourseviewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                                       res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(http_statuses.NOT_FOUND)
            return;
        }
        res.json(getCourseviewModel(foundCourse))
    })

    router.post('/', (req: RequestWithBody<CreateCourseModel>,
                                    res: Response<CourseViewModel>) => {
        if (!req.body.title){
            res.sendStatus(http_statuses.BAD_REQUEST);
            return;
        }
        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };
        db.courses.push(createdCourse)
        res
            .status(http_statuses.CREATED_201)
            .json(getCourseviewModel(createdCourse))
    })

    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                                          res: Response) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);

        res.sendStatus(http_statuses.NO_CONTEND)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,UpdateCourseModel>,
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
    return router
}