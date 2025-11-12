import {DBtype} from "../db/db";
import {http_statuses} from "../features/courses/courses.router";
import express from "express";


export const getTestsRoutes = (db: DBtype) => {
    const router = express.Router()
    router.delete('/data', (req, res) => {
        db.courses = [];

        res.sendStatus(http_statuses.NO_CONTEND)
    })
    return router
}
