const app = require("../app")
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json')

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
                body.data.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String), slug: expect.any(String)
                    })
                })
            })
    })
    test('404: responds with an appropriate message when an incorrect url is used', () => {
        return request(app)
            .get('/api/topicz')
            .expect(404)
    });
});

describe('GET /api', () => {
    test('200: responds with an object documenting all of the endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('200: responds with an article object containing the appropriate properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body).toMatchObject({article :{
                author: expect.any(String),
                title: expect.any(String),
                body: expect.any(String),
                topic: expect.any(String),
                article_img_url: expect.any(String),
                article_id: expect.any(Number),
                votes: expect.any(Number || Null),
                }
            });
        });
    });
    test('400: sends and appropriate status and error message when given an ivalid id', () => {
        return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('article does not exist')
            })
    })
});