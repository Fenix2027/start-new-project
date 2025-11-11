import {DBtype} from "../db/db";
import {http_statuses} from "./courses";
import express, {Express} from "express";


export const getTestsRoutes = (app: Express, db: DBtype) => {
    const router = express.Router()
    app.delete('/__test__/data', (req, res) => {
        db.courses = [];

        res.sendStatus(http_statuses.NO_CONTEND)
    })
}
