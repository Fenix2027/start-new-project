import request from 'supertest'
import {app, RouterPaths} from "../../src/app";
import {http_statuses} from "../../src/features/courses/courses.router";
import {CreateUserModel} from "../../src/features/users/modeis/CreateUserModel";


const getRequest = () => {
    return request(app)
}

describe('/users', () => {
    beforeAll(async () => {
        await getRequest().delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.users)
            .expect(http_statuses.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await getRequest()
            .get(`${RouterPaths.users}/1`)
            .expect(http_statuses.NOT_FOUND)
    })

    it('should not created course with incorrect input data', async () => {

        const data: CreateUserModel = {userName: ''};

        await request(app)

            .post(RouterPaths.users)
            .send(data)
            .expect(http_statuses.BAD_REQUEST)

        await request(app)
            .get(RouterPaths.users)
            .expect(http_statuses.OK_200, [])

    })

    let createEntity: any = null;
    it('should created course with correct input data', async () => {
        const data: CreateUserModel = {userName: 'dimych'};

        const createResponse = await getRequest()

            .post(RouterPaths.users)
            .send(data)
            .expect(http_statuses.CREATED_201)
        createEntity = createResponse.body;
        expect(createEntity).toEqual({
            id: expect.any(Number),
            userName: data.userName
        })

        await getRequest()
            .get(RouterPaths.users)
            .expect(http_statuses.OK_200, [createEntity])
    })
    let createEntity2: any = null;
    it('created one more entity', async () => {
        const data: CreateUserModel = {userName: 'ivan'};
        const createResponse = await request(app)

            .post(RouterPaths.users)
            .send(data)
            .expect(http_statuses.CREATED_201)
        createEntity2 = createResponse.body;
        expect(createEntity2).toEqual({
            id: expect.any(Number),
            userName: data.userName
        })

        await request(app)
            .get(RouterPaths.users)
            .expect(http_statuses.OK_200, [createEntity,createEntity2])
    })

    it('should not updated entity with incorrect input data', async () => {
        const data: CreateUserModel = {userName: ''};
        await request(app)

            .put(`${RouterPaths.users}/${createEntity.id}`)
            .send(data)
            .expect(http_statuses.BAD_REQUEST)

        await request(app)
            .get(`${RouterPaths.users}/${createEntity.id}`)
            .expect(http_statuses.OK_200, createEntity)
    })

    it('should not updated entity that not exist', async () => {
        const data: CreateUserModel = {userName: ''};
        await getRequest()

            .put(`${RouterPaths.users}/${-100}`)
            .send(data)
            .expect(http_statuses.NOT_FOUND)

    })

    it('should updated course with correct input data', async () => {
        const data: CreateUserModel = {userName: 'DIMYCH'};
        await getRequest()

            .put(`${RouterPaths.users}/${createEntity.id}`)
            .send(data)
            .expect(http_statuses.NO_CONTEND)

        await getRequest()
            .get(`${RouterPaths.users}/${createEntity.id}`)
            .expect(http_statuses.OK_200, {
                ...data,
                userName: data.userName
            })
    })

    it('should delete both courses.router.ts', async () => {
        await request(app)

            .delete(`${RouterPaths.users}/${createEntity.id}`)
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get(`${RouterPaths.users}/${createEntity.id}`)
            .expect(http_statuses.NOT_FOUND)

        await request(app)

            .delete(`${RouterPaths.users}/${createEntity2.id}`)
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get(`${RouterPaths.users}/${createEntity2.id}`)
            .expect(http_statuses.NOT_FOUND)
        await request(app)

            .get(RouterPaths.users)
            .expect(http_statuses.OK_200,[])
    })
})


