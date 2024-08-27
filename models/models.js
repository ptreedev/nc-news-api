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