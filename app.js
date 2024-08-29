const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticle } = require('./controllers/controllers')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticle)

app.all('*', (req, res) => {
  res.status(404).send({ msg: "URL not found"})
})

app.use((err, req, res, next)=>{
  if(err.code === '23503'){
    res.status(404).send({ msg: "article does not exist"})
  } else next(err);
})

app.use((err, req, res, next) => {
  if(err.code === '23502' && err.column === 'author'){
    res.status(400).send({ msg: "Username does not exist"})
  } else next(err);
}) 
app.use((err, req, res, next) => {
  if(err.code === '23502' && err.column === 'body'){
    res.status(400).send({ msg: "Body does not exist"})
  } else next(err);
}) 
app.use((err, req, res, next) => {
    if(err.code === "22P02") {
      res.status(400).send({ msg: "Bad request"})
    } else next(err);
  });

app.use((err, req, res, next) => {
    if(err.status && err.msg){
      res.status(err.status).send({ msg: err.msg})
    } else next(err)
  });  
  
app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app