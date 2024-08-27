const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleById } = require('./controllers/controllers')

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
      res.status(400).send({ msg: "Bad request"})
    } else next(err);
  })

app.use((err, req, res, next) => {
    console.log(err, "<-- error in 500");
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app