const express = require('express');
const app = express();
const { getTopics } = require('./controllers/controllers')

app.get('/api/topics', getTopics)


app.use((err, req, res, next) => {
    console.log(err, "<-- error in 500");
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app