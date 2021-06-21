const test = require('ava');
const dao_util = require('../dao-util')

test('build recipe SQL', t => {

	const ing1 = {
		ingredient: "water",
		unit: "oz",
		amount: 1
	} 
	const ing2 = {
		ingredient: "sugar",
		unit: "cube",
		amount: 3
	}
	const ingredient_arr = [ing1, ing2]

	const expected = `(1,'water','oz',1),\n(1,'sugar','cube',3)`
	t.is(expected, dao_util.buildRecipe(1, ingredient_arr));
})

test('build multiple recipes from SQL result', t => {

	const result_arr = [
		{name: "screwdriver",
		 ingredient: "vodka"},
		{name: "screwdriver",
		 ingredient: "orange juice"},
		{name: "moscow mule",
	     ingredient: "vodka"},
		{name: "moscow mule",
	     ingredient: "lime juice"},
		{name: "moscow mule",
	     ingredient: "ginger ale"}	 
	]


	const expected = [{name:'moscow mule', ingredient:{'ginger ale':true, 'lime juice':true, 'vodka': true}},
					  {name:'screwdriver', ingredient:{'orange juice':true, 'vodka':true}}]
	const actual = dao_util.buildCocktailFromRecipe(result_arr)

	t.deepEqual(expected, actual);
})