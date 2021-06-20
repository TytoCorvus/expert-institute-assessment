const pgp = require('pg-promise')();
const dao_utils = require('./dao-util')
const db = pgp(`postgres://postgres:postgres@localhost:5433/cocktail-db`)

var get_cocktail = (cocktail) => {
    return new Promise((resolve, reject) => {
        db.one(`SELECT *
                FROM public.cocktail 
                WHERE name='${cocktail}'`)
        .then((data) => {
            resolve(data)
        })
        .catch((err) => {   
            reject(err);
        })
    })
}

var get_recipe = (cocktail) => {
    return new Promise((resolve, reject) => {
        get_cocktail(cocktail)
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
        .catch(err => {
            reject(err)
        })
    })
}

var create_cocktail = ({name, recipe_array}) => {
    return new Promise((resolve, reject) => {        
        db.any(`INSERT INTO public.cocktail (name)
                VALUES ('${name}')`)
            .then( response => {
                db.any(`INSERT INTO public.recipes (id, ingredient, unit, amount)\nVALUES ${dao_utils.buildRecipe(response.id, recipe_array)}`)
                resolve(response);
            })
            .catch( err => {
                reject(err);
            })

    })
    
}

var delete_cocktail = (cocktail) => {
    return new Promise((resolve, reject) => {
            get_cocktail(cocktail)
            .then((cocktail_data) => {
                db.any(`DELETE FROM public.recipe
                        WHERE cocktail_id=${cocktail_data.id}`)
                    .then(() => {
                        db.one(`DELETE FROM public.cocktail
                                WHERE id=${cocktail_data.id}`)
                            .then(() => {
                                resolve(`${cocktail} successfully deleted`)
                            })
                            .catch((err) => {
                                resolve(err)
                            })
                    })
                    .catch((err) => {
                        resolve(err)
                    })
            })
            .catch((err) => {
                reject(`There are no cocktails by that name.`)
            })
    })
}

var update_cocktail = () => {

}


module.exports = {get_cocktail, get_recipe, create_cocktail, delete_cocktail};