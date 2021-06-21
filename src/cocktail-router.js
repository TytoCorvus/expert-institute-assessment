const { json } = require('express')
const express = require('express')
const { URL } = require('url')
const {get_recipe, create_cocktail, delete_cocktail, update_cocktail, search_for_ingredients, search_for_name} = require('./dao/postgres-dao')

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

router.post('/cocktail/update', (req, res, next) => {
    update_cocktail(req.body)
    .then( _ => {
        res.write(`${req.body.name} successfully updated`)
        res.send();
    })
    .catch( err => {
        next(err, req, res)
    })
})

router.post('/search/ingredients', (req, res, next) => {
    search_for_ingredients(req.body)
    .then( result => {
        res.write(JSON.stringify(result))
        res.send();
    })
    .catch( err =>
        next(err, req, res)
    )
})

router.post('/search/name', (req, res, next) => {
    search_for_name(req.body.name)
    .then( result => {
        res.write(JSON.stringify(result))
        res.send();
    })
    .catch( err =>
        next(err, req, res)
    )
})

module.exports = router;
