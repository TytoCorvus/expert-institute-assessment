module.exports.buildRecipe = (cocktail_id, ingredient_array) => {
    if(!Array.isArray(ingredient_array)){
        return null
    }

    const string_arr =  ingredient_array.map( ing => {
        return `(${cocktail_id},'${ing.ingredient}','${ing.unit}',${ing.amount})`
    })

    return string_arr.join(',\n')
}