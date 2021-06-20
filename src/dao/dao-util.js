module.exports.buildRecipe = (cocktail_id, ingredient_array) => {
    if(typeof ingredient_array != 'Array'){
        return ''
    }
    return ingredient_array.map( ingredient => {
        `(${cocktail_id},'${ingredient.ingredient}','${ingredient.unit}',${ingredient.amount})`
    }).join(',\n')
}