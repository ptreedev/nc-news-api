const { getArticles, getArticleById, patchArticle, getCommentsByArticleId, postCommentByArticleId } = require("../controllers/controllers");

const articlesRouter = require("express").Router();

articlesRouter
    .route('/')
    .get(getArticles);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)
    
module.exports = articlesRouter