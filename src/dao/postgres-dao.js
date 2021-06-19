const pgp = require('pg-promise')();
const db = pgp(`postgres://postgres:postgres@localhost:5433/cocktail-db`)

var get_cocktail = (cocktail) => {
    return new Promise((resolve, reject) => {
        db.one(`SELECT id 
                FROM public.cocktail 
                WHERE name='${cocktail}'`)
            .then((data) => {
                db.any(`SELECT ingredient, amount, unit
                        FROM public.recipe 
                        WHERE cocktail_id=${data.id}`)
                    .then((recipe_data) => {
                        if(typeof recipe_data == 'Array' || recipe_data.length == 0){
                            reject(`The recipe for the cocktail provided was empty`)
                        }
                        resolve(recipe_data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
            .catch((err) => {   
                reject(err);
            })
    })
}

var create_cocktail = (recipe) => {

}

var delete_cocktail = (cocktail) => {

}


module.exports = {get_cocktail, create_cocktail};