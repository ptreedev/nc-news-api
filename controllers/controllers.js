const { selectTopics, selectEndpoints } = require('../models/models')

exports.getTopics = (req, res, next) => {
    selectTopics().then((data) => {
        res.status(200).send({ data })

    })
        .catch(err => {
            next(err)
        })
};

exports.getEndpoints = (req, res, next) => {
    const endpoints = selectEndpoints();
    res.status(200).send(endpoints)
    
}