import request from 'supertest'
import {CreateCourseModel} from "../../src/modeis/CreateCourseModel";
import {UpdateCourseModel} from "../../src/modeis/UpdateCourseModel";
import {app, RouterPaths} from "../../src/app";
import {http_statuses} from "../../src/routes/courses.router";


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

    let createCourse: any = null;
    it('should created course with correct input data', async () => {
        const data: CreateCourseModel = {title: 'new course'};

        const createResponse = await getRequest()

            .post(RouterPaths.users)
            .send(data)
            .expect(http_statuses.CREATED_201)
        createCourse = createResponse.body;
        expect(createCourse).toEqual({
            id: expect.any(Number),
            title: 'new course'
        })

        await getRequest()
            .get(RouterPaths.users)
            .expect(http_statuses.OK_200, [createCourse])
    })
    let createCourse2: any = null;
    it('created one more course', async () => {
        const data: CreateCourseModel = {title: 'new course 2'};
        const createResponse = await request(app)

            .post(RouterPaths.users)
            .send(data)
            .expect(http_statuses.CREATED_201)
        createCourse2 = createResponse.body;
        expect(createCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get(RouterPaths.users)
            .expect(http_statuses.OK_200, [createCourse,createCourse2])
    })

    it('should not updated course with incorrect input data', async () => {
        const data: CreateCourseModel = {title: ''};
        await request(app)

            .put(`${RouterPaths.users}/${createCourse.id}`)
            .send(data)
            .expect(http_statuses.BAD_REQUEST)

        await request(app)
            .get(`${RouterPaths.users}/${createCourse.id}`)
            .expect(http_statuses.OK_200, createCourse)
    })

    it('should not updated course that not exist', async () => {
        const data: UpdateCourseModel = {title: 'new'};
        await getRequest()

            .put(`${RouterPaths.users}/${-100}`)
            .send(data)
            .expect(http_statuses.NOT_FOUND)

    })

    it('should updated course with correct input data', async () => {
        const data: UpdateCourseModel = {title: 'new course'};
        await getRequest()

            .put(`${RouterPaths.users}/${createCourse.id}`)
            .send(data)
            .expect(http_statuses.NO_CONTEND)

        await getRequest()
            .get(`${RouterPaths.users}/${createCourse.id}`)
            .expect(http_statuses.OK_200, {
                ...createCourse,
                title: data.title
            })
    })

    it('should delete both courses.router.ts', async () => {
        await request(app)

            .delete(`${RouterPaths.users}/${createCourse.id}`)
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get(`${RouterPaths.users}/${createCourse.id}`)
            .expect(http_statuses.NOT_FOUND)

        await request(app)

            .delete(`${RouterPaths.users}/${createCourse2.id}`)
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get(`${RouterPaths.users}/${createCourse2.id}`)
            .expect(http_statuses.NOT_FOUND)
        await request(app)

            .get(RouterPaths.users)
            .expect(http_statuses.OK_200,[])
    })
})


