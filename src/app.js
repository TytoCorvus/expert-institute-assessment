const express = require('express')
const otherfunc = require('./otherfile')
const { URL } = require('url')
const app = express()
const {test_func, get_cocktail} = require('./dao/postgres-dao')

app.get('/', (req, res) => {
    res.write("Hello, World!");
    res.end();
})

app.get('/other', (req, res) => {
    res.write(otherfunc());
    res.end();
})

app.get('/cocktail', (req, res) => {
    const provided_url = new URL(req.url, `http://${req.headers.host}`)
    const cocktail = provided_url.searchParams.get('name')
    get_cocktail(cocktail.toLowerCase())
    .then((data) => {
        res.write("Cocktail data:\n")
        res.write(JSON.stringify(data))
        res.send()
    })
    .catch((err) => {
        res.write(JSON.stringify(err))
        res.statusCode = 500
        res.send()
    })
})

app.get('/search', (req, res) => {

})

app.listen(500);