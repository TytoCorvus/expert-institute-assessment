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

//TODO sanitize inputs further, prevent ' from appearing, which would break the SQL
var create_cocktail = ({name, recipe}) => {
    return new Promise((resolve, reject) => {        
        db.one(`INSERT INTO public.cocktail (name)
                VALUES ('${name}')
                RETURNING id`)
            .then( response => {
                db.any(`INSERT INTO public.recipe (cocktail_id, ingredient, unit, amount)\nVALUES ${dao_utils.buildRecipe(response.id, recipe)}`)
                    .then( cocktail_data => {
                        resolve(`${name} was created successfully`)
                    })
                    .catch( err => {
                        reject('There was an issue creating the recipe')
                    })
            })
            .catch( err => {
                reject('There was an issue creating the cocktail - be sure a cocktail by this name does not already exist');
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