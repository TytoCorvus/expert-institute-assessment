const express = require('express')
const cocktail_router = require('./cocktail-router')
const app = express()

app.use(express.json());
app.use(cocktail_router);

app.get('/', (req, res, next) => {
    res.write("Hello, World!");
    res.end();
})

app.use(function (err, req, res, next) {
    if(!err){
        next()
    } else {
        res.write(JSON.stringify(err))
        res.status(500).send()
    }
  })

app.use(function (req, res, next) {
    res.status(404).send("We couldn't find the resource you were looking for :(")
  })

module.exports = app;