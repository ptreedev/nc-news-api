const app = require("../app")
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index');

beforeEach(() => {
    return seed(testData)
});
afterAll(() => {
    return db.end()
});

describe('GET /api/topics', () => {
    test('200: responds with an array of topic objects', () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                console.log(body)
                body.data.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String), slug: expect.any(String)
                    })
                })
            })
    })
})