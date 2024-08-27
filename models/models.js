const db = require('../db/connection');

exports.selectTopics = () => {
    console.log("in models")
    return db.query('SELECT * FROM topics')
    .then((results) => {return results.rows})
}