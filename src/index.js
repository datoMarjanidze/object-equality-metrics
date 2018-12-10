const { constructorParamsValidator, probabilityValueValidator } = require("./subroutines"); 
const { printErrorMsg, printSuccessMsg } = require("./utils");
const Strategies = require("./strategies");

/**
 * *** Main Class ***
 * 
 * @param {Object} objectOne is an object containing key-value pairs. 
 * Value type can be from one of these three types: string, number, boolean. 
 * @param {Object} objectTwo same as the objectOne.
 * @param {Object} keySpecificOptions
 * @param {Object} globalOptions
 */
module.exports = class {
	constructor(objectOne, objectTwo, keySpecificOptions, globalOptions) {
		const err = constructorParamsValidator(objectOne, objectTwo, keySpecificOptions, globalOptions = {});
		if (err) {
			printErrorMsg(`ObjectEqualityMetrics: ${err}`);
			process.exit();
		}
		else printSuccessMsg("ObjectEqualityMetrics: Constructor parameters are valid.");

		this.objectOne = objectOne;
		this.objectTwo= objectTwo;
		this.keySpecificOptions = keySpecificOptions;
		this.globalOptions = globalOptions;

		this._numberRegExp = new RegExp("^([0-9]+|[0-9]+\\.{0,1}|\\.{0,1}[0-9]+|[0-9]+\\.{0,1}[0-9]+)$");
		this._booleanRegExp = new RegExp("^(true|false)$");
		
		this._valuesProbabilities;
		this._initValuesProbabilities();
		this.__objectsMatchProbability = 0;
	}

	get info() {
		this._processValues();

		return {
			objectsMatchProbability: this._objectsMatchProbability,
			valuesProbabilities: this._valuesProbabilities
		};
	}

	get _objectsMatchProbability() {
		return this.__objectsMatchProbability;
	}

	set _objectsMatchProbability(value) {
		const err = probabilityValueValidator(value);
		if (err) {
			printErrorMsg(`ObjectEqualityMetrics: ${err}`);
			process.exit();
		}

		this.__objectsMatchProbability = value;
	}

	_initValuesProbabilities() {
		this._valuesProbabilities = { };
		const keys = Object.keys(keySpecificOptions);

		keys.forEach(key => {
			this._valuesProbabilities[key] = { };
			this._valuesProbabilities[key].entire = 0; 
			this._valuesProbabilities[key].byStrategies = { };
		});
	}

	_processValues() {
		const keySpecificOptionsKeys = Object.keys(this.keySpecificOptions);
		var weightsAndMatchProbabilities = [];

		keySpecificOptionsKeys.forEach(key => {
			if (String(this.objectOne[key]).match(this._numberRegExp) && String(this.objectTwo[key]).match(this._numberRegExp) && this.keySpecificOptions[key].valueRules.number.exact) { // Number
				const matchProbability = this.objectOne[key] === this.objectTwo[key] ? 1 : 0;
				weightsAndMatchProbabilities.push({ matchProbability: matchProbability, weight: this.keySpecificOptions[key].weight });
				this._valuesProbabilities[key].entire = matchProbability;
			}
			else if (String(this.objectOne[key]).match(this._booleanRegExp) && String(this.objectTwo[key]).match(this._booleanRegExp)) { // Boolean
				const matchProbability = this.objectOne[key] === this.objectTwo[key] ? 1 : 0;
				weightsAndMatchProbabilities.push({ matchProbability: matchProbability, weight: this.keySpecificOptions[key].weight });
				this._valuesProbabilities[key].entire = matchProbability;
			}
			else { // String
				const stringOne = String(this.objectOne[key]).toLowerCase(),
				stringTwo = String(this.objectTwo[key]).toLowerCase();
				
				const stringOneWords = stringOne.split(" "), 
				stringTwoWords = stringTwo.split(" ");
				
				Strategies.names.forEach(strategyKey => {
					if (typeof this.keySpecificOptions[key].strategies[strategyKey] !== "undefined") {
						if (strategyKey === "levenshtein-distance") {
							const results = [];
							stringOneWords.forEach((stringOneWord, i) => {
								results[i] = { stringOneWordMismatch: Infinity, holeLength: stringOneWord.length };

								stringTwoWords.forEach(stringTwoWord => {
									var res = new Strategies(stringOneWord, stringTwoWord).levenshteinDistance();
									results[i].stringOneWordMismatch > res ? results[i].stringOneWordMismatch = res : "";
								});
							});

							const allWordsLength = results.reduce((acc, currValue) => {
								return acc += currValue.holeLength;
							}, 0);
							const allWordsMismatch = results.reduce((acc, currValue) => {
								return acc += currValue.stringOneWordMismatch;
							}, 0);
							
							const matchProbability = (((allWordsLength - allWordsMismatch) * 100) / allWordsLength) / 100;
							weightsAndMatchProbabilities.push({ matchProbability: matchProbability, weight: this.keySpecificOptions[key].weight });
							this._valuesProbabilities[key].entire = matchProbability;
							this._valuesProbabilities[key].byStrategies[strategyKey] = matchProbability;
						}
					}
				});
			}
		});

		this._objectsMatchProbability = this.calculateObjectMatchProbability(weightsAndMatchProbabilities);
	}

	calculateObjectMatchProbability(weightsAndMatchProbabilities) {
		const weightsSum = weightsAndMatchProbabilities.reduce((acc, currValue) => acc += currValue.weight, 0);

		return weightsAndMatchProbabilities.reduce((acc, currValue) => {
			return acc += (currValue.matchProbability / weightsSum) * currValue.weight; 
		}, 0);
	}
};