const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require('./controllers/controllers')

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);


app.use((err, req, res, next) => {
    console.log(err, "<-- error in 500");
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app