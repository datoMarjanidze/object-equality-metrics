const STRATEGIES = Object.freeze(["hamming-distance", "sorensen-dice-coefficient", "levenshtein-distance", "smith-distance"]);
const levenshteinDistance = require("./levenshtein-distance");

module.exports = class {
	constructor(stringOne, stringTwo) {
		this.stringOne = stringOne;
		this.stringTwo = stringTwo;
	}

	static get names() {
		return STRATEGIES;
	}

	levenshteinDistance() {
		return levenshteinDistance(this.stringOne, this.stringTwo);
	}
};