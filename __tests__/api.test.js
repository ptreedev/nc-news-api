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
            .then(({ body }) => {
                expect(body.msg).toBe('URL not found')
            })
    });

});

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
                        votes: expect.any(Number),
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


});

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
});

describe('POST /api/articles/:article_id/comments', () => {
    test("201: responds with the posted comment and adds the comment to an article", () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'this article sucks'
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    author: 'butter_bridge',
                    body: 'this article sucks'
                })
            })
    })
    test("400: responds with an appropriate status and error message when provided with a non-existent user-name", () => {
        const newComment = {
            body: 'this article sucks'
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Username does not exist')
            })
    });
    test("400: responds with an appropriate status and error message when provided with a non-existent body", () => {
        const newComment = {
            username: 'butter_bridge'
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Body does not exist')
            })
    })
    test('404: responds with appropriate status and msg when given a valid id but non-existent id', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'this article sucks'
        };
        return request(app)
            .post("/api/articles/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('article does not exist')
            });
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: Responds with correct status and updated vote count of specific article', () => {
        const newVote = 10
        const votePatch = {
            inc_votes: newVote
        }
        return request(app)
            .patch("/api/articles/1")
            .send(votePatch)
            .expect(200)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    article: {
                        author: expect.any(String),
                        title: expect.any(String),
                        body: expect.any(String),
                        topic: expect.any(String),
                        article_img_url: expect.any(String),
                        article_id: 1,
                        votes: 110,
                    }
                })
            })
    });
    test('200: Responds with correct status and updated article when downvoting', () => {
        const newVote = -101
        const votePatch = {
            inc_votes: newVote
        }
        return request(app)
            .patch("/api/articles/1")
            .send(votePatch)
            .expect(200)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    article: {
                        author: expect.any(String),
                        title: expect.any(String),
                        body: expect.any(String),
                        topic: expect.any(String),
                        article_img_url: expect.any(String),
                        article_id: 1,
                        votes: -1,
                    }
                })
            })
    })
    test('400: Responds with appropriate message and code when invalid article requested', () => {
        const newVote = 10
        const votePatch = {
            inc_votes: newVote
        }
        return request(app)
            .patch("/api/articles/banana")
            .send(votePatch)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test('404: Responds with appropriate message and code when valid but non-existing article requested', () => {
        const newVote = 10
        const votePatch = {
            inc_votes: newVote
        }
        return request(app)
            .patch("/api/articles/999")
            .send(votePatch)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("article does not exist")
            })
    })
    test('400: Responds with appropriate message and code when invalid PATCH body sent', () => {
        const newVote = "cat"
        const votePatch = {
            inc_votes: newVote
        }
        return request(app)
            .patch("/api/articles/1")
            .send(votePatch)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
})

describe("DELETE /api/comments/:comment_id", () => {
    test("204: deletes the given comment by comment_id and sends the status code and no content", () => {
        return request(app)
            .delete("/api/comments/2")
            .expect(204)
    })
    test("400: returns status code and appropriate message when given an invalid cooment_id", () => {
        return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("404: returns status code and appropriate message when given a valid but non-existent comment_id", () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("comment does not exist")
            })
    })
})

describe("GET /api/users", () => {
    test("200: gets all users and responds with an array of objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users.length).toBe(4)
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
})

describe("GET GET /api/articles (sorting queries)", () => {
    test("200: responds with an array of article objects sorted by any column in default descending order", () => {
        return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('title', { descending: true })
            })
    })
    test("400: responds with appropriate status and message when query value for sort_by is not valid", () => {
        return request(app)
            .get("/api/articles?sort_by=carrot")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid request")
            })
    })
    test("200: responds with an array of article objects sorted by default column created_by in ascending order", () => {
        return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', { ascending: true })
            })
    })
    test("200: responds with an array of article objects sorted by default column created_by in descending order", () => {
        return request(app)
            .get("/api/articles?order=desc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', { descending: true })
            })
    })
    test("400: responds with appropriate status and message when query value for order is not valid", () => {
        return request(app)
            .get("/api/articles?order=lowest")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid request")
            })
    })
    test("200: responds with an array of article objects sorted by chosen column in chosen order", () => {
        return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('title', { ascending: true })
        })
    })
    test("400: responds with appropriate status and message when query is not valid when using both sort_by and order", () => {
        return request(app)
            .get("/api/articles?sort_by=carrot&order=lowest")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid request")
            })
    })
})