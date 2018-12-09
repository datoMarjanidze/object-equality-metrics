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

// const globalOptions = Object.freeze({
// 	strategies: {
// 		"hamming-distance": false,
// 		"sorensen-dice-coefficient": false,
// 		"levenshtein-distance": false,
// 		"smith-distance": false,
// 	},
// 	valueRules: {
// 		string: { },
// 		number: {
// 			exact: true
// 		},
// 		boolean: { }
// 	}
// });

(async () => {
	const equality1 = new ObjectEqualityMetrics(objectOne, objectTwo, keySpecificOptions);
	console.log(JSON.stringify(await equality1.info))
})();

// const Strategies = require("./src/strategies");
// const levenshteinDistance = (new Strategies("2000.2", "2000.1")).levenshteinDistance();
// console.log(levenshteinDistance);