const pgp = require('pg-promise')();
const dao_utils = require('./dao-util')

const {db_host, db_user, db_pass, db_port} = process.env
const db = pgp(`postgres://${db_user}:${db_pass}@${db_host}:${db_port}/cocktail-db`)

//TODO Use stored functions or procedures instead of SQL directly in code

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
                        console.log(JSON.stringify(err))
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

//TODO update this pattern - leaves the DB in an improper state if the create fails after the delete completes
//Ideally, this would be a single transaction for the DB
//Current iteration, this also changes the cocktail ID, which isn't desirable
var update_cocktail = ({name, recipe}) => {
    return new Promise( (resolve, reject) => {
        delete_cocktail(name)
        .then( data => {
            create_cocktail({name, recipe})
            .then( result => {
                resolve(`${name} updated successfully`)
            })
            .catch( err => {
                reject(err)
            })
        })
        .catch(err => {
            reject(err)
        })
    })
}

var search_for_name = ((name) => {
    return new Promise((resolve, reject) => {
        db.any(`SELECT *
                FROM public.cocktail
                WHERE name LIKE '%${name}%'`)
        .then( data => {
            resolve(data)
        })
        .catch( err => {
            reject(err);
        })
    })
})

var search_for_ingredients = ((ingredients) => {
    if(!ingredients || ingredients.length == 0){
        return new Promise(( _ , reject) => {
            reject(`Invalid ingredient array`);
        })
    }

    return new Promise((resolve, reject) => {
        db.any(`SELECT ctail.name
                FROM recipe as r
                JOIN cocktail as ctail ON r.cocktail_id=ctail.id
                WHERE r.ingredient = '${ingredients[0]}'`)
        .then( data => {
            db.any(`SELECT ctail.name, r.ingredient
                    FROM recipe as r
                    JOIN cocktail as ctail ON r.cocktail_id=ctail.id
                    WHERE ctail.name IN (${data.map( cocktail => {return "'" + cocktail.name + "'"}).join(',')})`)
                    .then( cocktail_data => {
                        const recipes = dao_utils.buildCocktailFromRecipe(cocktail_data)
                        const filtered_recipes = []

                        for(var recipe in recipes){
                            var missing = false;
                            for(var ingr in ingredients){
                                console.log(JSON.stringify(recipes[recipe].ingredient))
                                if(!recipes[recipe].ingredient[ingredients[ingr]]){
                                    missing = true;
                                    break;
                                }
                            }
                            if(!missing){
                                filtered_recipes.push(recipes[recipe])
                            }
                        }

                        resolve(filtered_recipes)
                    })
                    .catch( err => {
                        reject(`There was an issue with your search: ${JSON.stringify(err)}`)
                    })
        })
        .catch(err => {
            reject(err)
        })
    })
})

module.exports = {get_cocktail, get_recipe, create_cocktail, delete_cocktail, update_cocktail, search_for_ingredients, search_for_name};