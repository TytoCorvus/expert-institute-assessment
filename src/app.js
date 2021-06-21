//Gather environment vars from .env file
require('dotenv').config()
const add_sample_cocktails = require('./dao/add-sample-cocktails')

const initialize_db = require('./dao/initialize-db')

const startup = () => {
    const app = require('./basic-router')
    app.listen(process.env.PORT ? process.env.PORT : 500);
}

//Initialize the database to ensure the rest of the app runs as required
if(process.env.create_db.toLowerCase() == 'true'){
    initialize_db()
    .then( response => {
        startup()
        //add_sample_cocktails()
    })
    .catch( err => {
        console.log(JSON.stringify(err));
        console.log(`There was an issue initializing the database - closing app.`)
    })
} else {
    startup()
}

