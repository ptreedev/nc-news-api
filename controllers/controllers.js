const {selectTopics} = require('../models/models')

exports.getTopics = (req,res,next) => {
    console.log('in controller')
    selectTopics().then((data) => {
        res.status(200).send({data})
    })
}