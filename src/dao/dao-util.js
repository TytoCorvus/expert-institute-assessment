module.exports.buildRecipe = (cocktail_id, ingredient_array) => {
    if(!Array.isArray(ingredient_array)){
        return null
    }

    const string_arr =  ingredient_array.map( ing => {
        return `(${cocktail_id},'${ing.ingredient}','${ing.unit}',${ing.amount})`
    })

    return string_arr.join(',\n')
}

module.exports.buildCocktailFromRecipe = sql_result_array => {
    const result_map = {}

    sql_result_array.forEach( row => {
        if(!result_map[row.name]){
            result_map[row.name] = {name: row.name, ingredient:{}}
        }

        result_map[row.name].ingredient[row.ingredient] = true
    })

    const result_arr = []
    for(var key in result_map){
        result_arr.push(result_map[key])
    }

    //Return the array in ascending order by cocktail name
    return result_arr.sort((a,b) => {return a.name > b.name ? 1 : -1});
}

module.exports.paginateResult =  result_array => {

}