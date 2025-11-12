import express from 'express'
import {getCoursesRouter} from "./routes/courses.router";
import {getTestsRoutes} from "./routes/tests";
import {db} from "./db/db";
import {getUsersRouter} from "./routes/users.router";

export const app = express()
export const jsonBodyMiddleware = express.json()

export const RouterPaths = {
    courses: '/courses',
    users: '/users',
    __test__: '/__test__'
}
app.use(jsonBodyMiddleware)

app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.__test__, getTestsRoutes(db))


