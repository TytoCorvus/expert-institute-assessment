const fs = require('fs');
const pgp = require('pg-promise')();

const initialize = () => {

    const {initial_db, db_host, db_user, db_pass, db_port} = process.env
    const initial_db_instance = pgp(`postgres://${db_user}:${db_pass}@${db_host}:${db_port}/${initial_db}`)
    return new Promise((resolve, reject) => {
        //TODO check this before instantiation
        initial_db_instance.any(`SELECT *\nFROM pg_catalog.pg_tables\nWHERE schemaname != 'pg_catalog' AND\nschemaname != 'information_schema';`)
        .then(result => {
            console.log(result);
            initial_db_instance.any(`CREATE DATABASE "cocktail-db" WITH OWNER=${db_user}`)
                .then( _ => {
                    populate_cocktail_db()
                    .then( data => {
                        resolve(`cocktail-db instantiation complete!`)
                    })
                    .catch( err => {
                        reject(`cocktail-db instantiation failed.\n${JSON.stringify(err)}`)
                    })
                })
                .catch( err => {
                    reject(`Error creating cocktail-db: ${JSON.stringify(err)}`)
                })
        })
        .catch( err => {
            console.log(err);
            reject(err);
        })
    }) 
}

const populate_cocktail_db = () => {

    return new Promise((resolve, reject) => {
        const {db_host, db_user, db_pass, db_port} = process.env
        //TODO close this connection
        const db = pgp(`postgres://${db_user}:${db_pass}@${db_host}:${db_port}/cocktail-db`)

        //This would be more dynamic in a production environment
        const PWD = process.cwd();
        const create_cocktail_sql = fs.readFileSync(PWD + '/src/dao/sql/table/public.cocktail.sql', {encoding: 'utf-8'})
        const create_recipe_sql = fs.readFileSync(PWD + '/src/dao/sql/table/public.recipe.sql', {encoding: 'utf-8'})

        // const populate_cocktails_sql = fs.readFileSync(PWD + '/src/dao/sql/adhoc/populate-cocktail.sql', {encoding: 'utf-8'})
        // const populate_recipes_sql = fs.readFileSync(PWD + '/src/dao/sql/adhoc/populate-recipe.sql', {encoding: 'utf-8'})

        db.any(create_cocktail_sql)
        .then( _ => {db.any(create_recipe_sql)})
        //There's some issue here - recipes not properly populating. Will fix later.
        //.then( _ => {db.any(populate_cocktails_sql)})
        //.then( _ => {db.any(populate_recipes_sql)})
        .then( _ => {
            resolve(`cocktail-db instantiation complete`)})
        .catch( err => reject(`Error populating cocktail-db: ${JSON.stringify(err)}`))
    })
}

module.exports = initialize;

