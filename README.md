
Hello!

This application is a simple node + express REST api that is responsible for communicating between a client of your choice (I'd recommend postman for ease of use) and a postgreSQL database. Currently, this API covers the following cocktail-db functionality at these endpoints:

GET '/cocktail' : Gets the recipe for the cocktail provided in the query parameters via name=cocktail_name and returns it in JSON

PUT '/cocktail' : creates a new recipe for a cocktail if one by that name does not already exist. Supply a cocktail in the following format in the body to be accepted:
    {
        "name":"martini",
        "recipe": [
            {"ingredient": "gin",
            "unit": "oz",
            "amount": .66},
            {"ingredient": "dry vermouth",
            "unit": "oz",
            "amount": 0.33},
            {"ingredient": "olive",
            "unit": "whole",
            "amount": 1}
        ]
    }

DELETE '/cocktail' : deletes a cocktail by the specified name. Submit the cocktail name in the body like so:
    {"name":"sangria"}

POST '/cocktail/update' : Updates the cocktail with the provided body - its structure is identical to the body required for PUT '/cocktail'

POST '/search/name' : searches for cocktails whose names contain a matching string. For example, passing 'old' could return an 'Old Fashioned' and a 'Golden Dream'. Pass a body like so: {"name":"old"}

POST '/search/ingredients' : searches for cocktails with recipes that contain all of the supplied ingredients. Pass an array of strings (ingredient names) to search - The following might return 'moscow mule' and 'lime drop martini':
["vodka","lime juice"]


USAGE:
    In order for this project to work, the user will need to have Node.js installed, as well as access to postgres. For the latter, either having a local copy of the instance of the dbms or a docker container should work fine. 
    The user will also need to create a '.env' file in the root directory of the project that provides the following variables in the format varname=value: 
        DB_HOST=?
        DB_USER=?
        DB_PASS=?
        DB_PORT=?
        APP_PORT=?
        INITIAL_DB=?
        CREATE_DB=?

    I have included a .env file that worked for me when I was using docker for my database solution - setting the CREATE_DB flag to true will cause the application to create the db schema it needs on startup. The process from here is fairly straightforward - first be sure to run 'npm install' in the application directory, to confirm you have all of the required dependencies. Then, run the following to open the docker container:

    docker run --name postgres-cocktail-db -e POSTGRES_PASSWORD=DB_PASS -d -p DB_PORT:5432 postgres

    being sure that DB_PORT matches the DB_PORT variable in the .env file. The POSTGRES_PASSWORD should also match the DB_PASS provided in the .env file. If you don't have the postgres image downloaded, it may download it before running - this is expected. 
    Afterwards, you can start using it!
    Run 'npm start' and the application will open. You can begin hitting localhost with the port and endpoints provided to write cocktails to the database, and read them out or delete them afterwards.

    

