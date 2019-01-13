const { ObjectEqualityMetrics } = require("./index");

const objectOne = Object.freeze({
	title: "Manufacturer is called `Nike`",
	// info: "Testing the environment of the system.",
	code: 1199,
	hasBudget: true
});

const objectTwo = Object.freeze({
	title: "Manufacturer was called `Nike`",
	// info: "Testing the environment of the sub system.",
	code: 1299,
	hasBudget: true
});

const titleOptions = Object.freeze({
	strategies: {
		// "hamming-distance": false,
		// "sorensen-dice-coefficient": false,
		"levenshtein-distance": { breakSentence: true, wholeSentence: false, weight: 1 },
		// "smith-distance": false,
	},
	valueRules: {
		string: {
			exact: false
		},
		number: {
			exact: true
		},
		boolean: { }
	},
	weight: .9
});

const codeOptions = Object.freeze({
	strategies: {

	},
	valueRules: {
		string: {
			exact: false
		},
		number: {
			exact: true
		},
		boolean: { }
	},
	weight: 0
});

const hasBudgetOptions = Object.freeze({
	strategies: {

	},
	valueRules: {
		string: {
			exact: false
		},
		number: {
			exact: true
		},
		boolean: { }
	},
	weight: .1
});

keySpecificOptions = Object.freeze({
	title: titleOptions,
	code: codeOptions,
	hasBudget: hasBudgetOptions
});

const equality1 = new ObjectEqualityMetrics(objectOne, objectTwo, keySpecificOptions);
console.table(equality1.info)
console.log(JSON.stringify(equality1.info));
// console.log(equality1.info)