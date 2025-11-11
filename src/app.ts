import express from 'express'
import {getCoursesRouter} from "./routes/courses";
import {getTestsRoutes} from "./routes/tests";
import {db} from "./db/db";

export const app = express()
export const jsonBodyMiddleware = express.json()


app.use(jsonBodyMiddleware)

const coursesRouter = getCoursesRouter(db);
app.use("/courses", coursesRouter)
getTestsRoutes(app, db)

