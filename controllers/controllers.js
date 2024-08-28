const { selectTopics, selectEndpoints, selectArticleById, selectArticles, selectCommentsByArticleId, insertComment } = require('../models/models')

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

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then(article => {
        res.status(200).send({ article })
    })
        .catch(err => {
            next(err)
        });
}

exports.getArticles = (req, res, next) => {
    selectArticles().then(articles => {
        res.status(200).send({ articles })
    })

}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id).then(comments => {
        res.status(200).send({ comments })
    })
        .catch(err => {
            next(err)
        })
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    insertComment(newComment, article_id).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(err => {
        next(err)
    })
}