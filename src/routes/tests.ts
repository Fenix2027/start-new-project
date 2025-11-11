import {DBtype} from "../db/db";
import {http_statuses} from "./courses";
import {Express} from "express";


export const addTestsRoutes = (app: Express, db: DBtype) => {
    app.delete('/__test__/data', (req, res) => {
        db.courses = [];

        res.sendStatus(http_statuses.NO_CONTEND)
    })
}
