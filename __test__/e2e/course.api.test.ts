import request from 'supertest'
import {app, http_statuses} from '../../src'
describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(http_statuses.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/1')
            .expect(http_statuses.NOT_FOUND)
    })

    it('should not created course with incorrect input data', async () => {
        await request(app)

            .post('/courses')
            .send({title: ''})
            .expect(http_statuses.BAD_REQUEST)

        await request(app)
            .get('/courses')
            .expect(http_statuses.OK_200, [])

    })

    let createCourse: any = null;
    it('should created course with correct input data', async () => {
        const createResponse = await request(app)

            .post('/courses')
            .send({title: 'new course'})
            .expect(http_statuses.CREATED_201)
         createCourse = createResponse.body;
        expect(createCourse).toEqual({
            id: expect.any(Number),
            title: 'new course'
        })

        await request(app)
            .get('/courses')
            .expect(http_statuses.OK_200, [createCourse])
    })
    let createCourse2: any = null;
    it('created one more course', async () => {
        const createResponse = await request(app)

            .post('/courses')
            .send({title: 'new course 2'})
            .expect(http_statuses.CREATED_201)
        createCourse2 = createResponse.body;
        expect(createCourse2).toEqual({
            id: expect.any(Number),
            title: 'new course 2'
        })

        await request(app)
            .get('/courses')
            .expect(http_statuses.OK_200, [createCourse,createCourse2])
            })

    it('should not updated course with incorrect input data', async () => {
        await request(app)

            .put('/courses/' + createCourse.id)
            .send({title: ''})
            .expect(http_statuses.BAD_REQUEST)

        await request(app)
            .get('/courses/' + createCourse.id)
            .expect(http_statuses.OK_200, createCourse)
    })

    it('should not updated course that not exist', async () => {
        await request(app)

            .put('/courses/' + -100)
            .send({title: 'new'})
            .expect(http_statuses.NOT_FOUND)

    })

    it('should updated course with correct input data', async () => {
        await request(app)

            .put('/courses/' + createCourse.id)
            .send({title: 'new course'})
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get('/courses/' + createCourse.id)
            .expect(http_statuses.OK_200, {
                ...createCourse,
                title: 'new course'
            })
    })

    it('should delete both courses', async () => {
        await request(app)

            .delete('/courses/' + createCourse.id)
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get('/courses/' + createCourse.id)
            .expect(http_statuses.NOT_FOUND)

        await request(app)

            .delete('/courses/' + createCourse2.id)
            .expect(http_statuses.NO_CONTEND)

        await request(app)
            .get('/courses/' + createCourse2.id)
            .expect(http_statuses.NOT_FOUND)
        await request(app)

            .get('/courses')
            .expect(http_statuses.OK_200,[])
            })
    })



