const express = require('express')
const { URL } = require('url')
const app = express()
const {test_func, get_cocktail} = require('./dao/postgres-dao')

app.get('/', (req, res, next) => {
    res.write("Hello, World!");
    res.end();
})

app.get('/other', (req, res, next) => {
    res.write(otherfunc());
    res.end();
})

app.get('/cocktail', (req, res, next) => {
    const provided_url = new URL(req.url, `http://${req.headers.host}`)
    const cocktail = provided_url.searchParams.get('name')
    get_cocktail(cocktail.toLowerCase())
    .then((data) => {
        res.write("Cocktail data:\n")
        res.write(JSON.stringify(data))
        res.send()
    })
    .catch((err) => {
        next(err, req, res)
    })
})

app.get('/search', (req, res) => {

})

app.use(function (err, req, res, next) {
    if(!err){
        next()
    } else {
        console.error(JSON.stringify(err))
        res.write(JSON.stringify(err))
        res.status(500).send()
    }
  })

app.use(function (req, res, next) {
    res.status(404).send("We couldn't find the resource you were looking for :(")
  })

app.listen(500);