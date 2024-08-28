const app = require("../app")
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json');
const { string } = require("pg-format");

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
});
describe('Non-existent endpoint', () => {
    test('404: responds with an appropriate message when an incorrect url is used', () => {
        return request(app)
            .get('/api/topicz')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('URL not found')
            })
    });
    
})

describe('GET /api', () => {
    test('200: responds with an object documenting all of the endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpoints)
            })
    })
});

describe('GET /api/articles/:article_id', () => {
    test('200: responds with an article object containing the appropriate properties', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    article: {
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
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('article does not exist')
            })
    })
});

describe('GET /api/articles', () => {
    test('200: responds with an array of articles objects', () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', { descending: true })
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        topic: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String)
                    })
                    expect(article).not.toHaveProperty('body')
                })
            })
    })

})

describe('GET /api/articles/:article_id/comments', () => {
    test('200: responds with an array of comments for the given article_id', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length >= 1)
                expect(body.comments).toBeSortedBy('created_at', {
                    descending: true
                })
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        created_at: expect.any(String),
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                })
            })
    })
    test('404: responds with appropriate status and msg when given a valid id but non-existent id', () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('article does not exist')
        });
    })
    test('400: sends and appropriate status and error message when given an ivalid id', () => {
        return request(app)
            .get("/api/articles/banana/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
})