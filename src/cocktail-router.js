const express = require('express')
const { URL } = require('url')
const {get_recipe, create_cocktail, delete_cocktail} = require('./dao/postgres-dao')

const router = express()

//TODO sanitize inputs - prevent SQL injection

router.get('/cocktail', (req, res, next) => {
    const provided_url = new URL(req.url, `http://${req.headers.host}`)
    const cocktail = provided_url.searchParams.get('name')
    get_recipe(cocktail.toLowerCase())
    .then((data) => {
        res.write(JSON.stringify(data))
        res.send()
    })
    .catch((err) => {
        next(err, req, res)
    })
})

router.put('/cocktail', (req, res, next) => {
    create_cocktail(req.body)
    .then( data => {
        res.write(`${req.body.name} created successfully!`)
        res.send();
    })
    .catch( err => {
        next(err, req, res)
    })
})

router.delete('/cocktail', (req, res, next) => {
    delete_cocktail(req.body.name)
    .then( _ => {
        res.write(`${req.body.name} successfully deleted`)
        res.send();
    })
    .catch( err => {
        next(err, req, res)
    })
})

router.get('/search', (req, res, next) => {

})

module.exports = router;
