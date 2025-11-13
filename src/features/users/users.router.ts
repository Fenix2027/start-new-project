import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {DBtype, UserType} from "../../db/db";
import {http_statuses} from "../../utils";
import {UserViewModel} from "./modeis/UserViewModel";
import {CreateUserModel} from "./modeis/CreateUserModel";
import {URIParamsUserIdModel} from "./modeis/URIParamsUserIdModel";
import {QueryUserModel} from "./modeis/QueryUserModel";
import {UpdateUserModel} from "./modeis/UpdateUserModel";


export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}

export const getUsersRouter = (db: DBtype) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryUserModel>,
                                   res: Response<UserViewModel[]>) => {
        let foundUser = db.users;
        if(req.query.userName) {
            foundUser = foundUser
                .filter(c => c.userName.indexOf(req.query.userName) > -1)
        }
        res.json(foundUser.map(mapEntityToViewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
                                       res: Response<UserViewModel>) => {
        const foundUser = db.users.find(c => c.id === +req.params.id);
        if (!foundUser) {
            res.sendStatus(http_statuses.NOT_FOUND)
            return;
        }
        res.json(mapEntityToViewModel(foundUser))
    })

    router.post('/', (req: RequestWithBody<CreateUserModel>,
                                    res: Response<UserViewModel>) => {
        if (!req.body.userName){
            res.sendStatus(http_statuses.BAD_REQUEST);
            return;
        }
        const createdUser: UserType = {
            id: +(new Date()),
            userName: req.body.userName
        };
        db.users.push(createdUser)
        res
            .status(http_statuses.CREATED_201)
            .json(mapEntityToViewModel(createdUser))
    })

    router.delete('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
                                          res: Response) => {
        db.users = db.users.filter(c => c.id !== +req.params.id);

        res.sendStatus(http_statuses.NO_CONTEND)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel,UpdateUserModel>,
                                       res: Response) => {
        if (!req.body.userName){
            res.sendStatus(http_statuses.BAD_REQUEST);
            return;
        }
        const foundUser = db.users.find(c => c.id === +req.params.id);
        if (!foundUser) {
            res.sendStatus(http_statuses.NOT_FOUND)
            return;
        }
        foundUser.userName = req.body.userName
        res.sendStatus(http_statuses.NO_CONTEND)
    })
    return router
}