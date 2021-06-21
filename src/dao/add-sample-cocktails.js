const psql_dao = require('./postgres-dao')

var sample_cocktails = [
    {
        "name" :"old fashioned",
        "recipe":[
            {"ingredient": "angostura bitters",
            "unit":"dash",
            "amount":2},
            {"ingredient": "bourbon",
            "unit":"cL",
            "amount":4.5},
            {"ingredient": "sugar",
            "unit":"cube",
            "amount":1},
            {"ingredient": "water",
            "unit":"dash",
            "amount":1}
        ]
    },
    {
        "name" :"long island iced tea",
        "recipe":[
            {"ingredient": "coke",
            "unit":"dash",
            "amount":1},
            {"ingredient": "gin",
            "unit":"oz",
            "amount":0.5},
            {"ingredient": "lemon peel",
            "unit":"twist",
            "amount":1},
            {"ingredient": "light rum",
            "unit":"oz",
            "amount":0.5},
            {"ingredient": "tequila",
            "unit":"oz",
            "amount":0.5},
            {"ingredient": "vodka",
            "unit":"oz",
            "amount":0.5}
        ]
    },
    {
        "name" :"margarita",
        "recipe":[
        ]
    },
    {
        "name" :"moscow mule",
        "recipe":[
            {"ingredient": "ginger ale",
            "unit":"oz",
            "amount":8},
            {"ingredient": "lime juice",
            "unit":"oz",
            "amount":2},
            {"ingredient": "vodka",
            "unit":"oz",
            "amount":2}
        ]
    },
    {
        "name" :"screwdriver",
        "recipe":[
            {"ingredient": "orange juice",
            "unit":"oz",
            "amount":10},
            {"ingredient": "vodka",
            "unit":"oz",
            "amount":2}
        ]
    }
]

module.exports = () => {
    //TODO make this... less hideous. Originally was in a forEach loop but was causing some sort of race condition
    psql_dao.create_cocktail(sample_cocktails.pop())
    .then(psql_dao.create_cocktail(sample_cocktails.pop()))
    .then(psql_dao.create_cocktail(sample_cocktails.pop()))
    .then(psql_dao.create_cocktail(sample_cocktails.pop()))
    .then(psql_dao.create_cocktail(sample_cocktails.pop()))
    .catch('Error inserting sample cocktails!')
}