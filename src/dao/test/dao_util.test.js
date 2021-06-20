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