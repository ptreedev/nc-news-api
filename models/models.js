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