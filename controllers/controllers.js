const { selectTopics, selectEndpoints, selectArticleById, selectArticles, selectCommentsByArticleId, insertComment, modifyArticle, removeCommentById, selectUsers } = require('../models/models')

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
    const { sort_by, order, topic } = req.query
    selectArticles(sort_by, order, topic).then(articles => {
        res.status(200).send({ articles })
    })
    .catch(err => {
        next(err)
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

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    modifyArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({ article })
    })
        .catch(err => {
            next(err)
        })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id).then(() => {
        res.status(204).send();
    })
        .catch(err => {
            next(err)
        })
}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch(err => {
        next(err)
    })
}