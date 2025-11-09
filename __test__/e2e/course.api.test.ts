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

    it('should created course with correct input data', async () => {
        await request(app)
            .post('/courses')
            .send({title: 'new course'})
            .expect(http_statuses.CREATED_201)
    })

})



