const db = require('../db/connection');
const endpoints = require('../endpoints.json')
exports.selectTopics = () => {
    return db.query('SELECT * FROM topics')
    .then((results) => {
        return results.rows})
}

exports.selectEndpoints = () => {
    return endpoints
}

exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((results) => {
        if (results.rows.length === 0){
           return Promise.reject({
                status: 404,
                msg: 'article does not exist'
            })
        }
        return results.rows[0];
    })
}

exports.selectArticles = () => {
    return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC')
    .then((results) => {
        return results.rows
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
    .then((results) => {
        if (results.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'article does not exist'
            })
        }
        return results.rows
    })
}

exports.insertComment = ({username, body}, article_id) => {
    return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *', [username, body, article_id])
    .then((result) => {
        return result.rows[0]
    })
}

exports.modifyArticle = (article_id, inc_votes) => {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [inc_votes, article_id])
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'article does not exist'
            })
        }
        return result.rows[0]
    })
}

exports.removeCommentById = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then(results => {
        if(results.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: 'comment does not exist'
            })
        }
    })
}