const Strategies = require("../strategies");
const weightValueValidator = require("./weight-value-validator");
module.exports = (objectOne, objectTwo, keySpecificOptions, globalOptions) => {
	var err = null;

	// Test 1
	const keySpecificOptionsAreValid = validateKeySpecificOptions(keySpecificOptions);
	if (!keySpecificOptionsAreValid) err = "Something is wrong in the `keySpecificOptions`.";
	
	// Test 2
	// const globalOptionsAreValid = validateOptions(globalOptions);
	// if (!globalOptionsAreValid) err = "Something is wrong in the `globalOptions`.";

	// Test 3
	const allKeysExist = allKeysExistInBoth(objectOne, objectTwo);
	if (!allKeysExist) err = "Each key in the objectOne, must exist in the objectTwo.\n" +
		"There must not be extra keys which doesn't exist in the other object.";

	// Test 4
	const objectOneValuesTypesAreOkay = checkObjectValuesTypes(objectOne);
	const objectTwoValuesTypesAreOkay = checkObjectValuesTypes(objectTwo);
	if (!objectOneValuesTypesAreOkay || !objectTwoValuesTypesAreOkay) err = "`objectOne` & `objectTwo` keys' values' types can" +
		"be one of the following:\n string, number or boolean.";
	
	return err;
};



function allKeysExistInBoth(objectOne, objectTwo) {
	var exists = true;
	const objectOneKeys = Object.keys(objectOne),
	objectTwoKeys = Object.keys(objectTwo);
	
	objectOneKeys.forEach(key => { if (typeof objectTwo[key] === "undefined") exists = false; });

	objectTwoKeys.forEach(key => { if (typeof objectOne[key] === "undefined") exists = false; });

	return exists;
}

function checkObjectValuesTypes(object) {
  var valid = true;
	const objectKeys = Object.keys(object);

	objectKeys.forEach(key => { 
		if (
			!(typeof object[key] === "string" || 
			typeof object[key] === "number" || 
			typeof object[key] === "boolean")
		) valid = false; 
	});

	return valid;
}

function validateKeySpecificOptions(keySpecificOptions) {
	var valid = true;
	const keySpecificOptionsKeys = Object.keys(keySpecificOptions);
	
	keySpecificOptionsKeys.forEach(key => {
		if (!(keySpecificOptions[key] instanceof Object)) valid = false;
		else if (Object.keys(keySpecificOptions[key]).length) {
			if (!validateOptions(keySpecificOptions[key])) valid = false; 
		}
	});

	return valid;
}

function validateOptions(options) {
	var valid = true;
	
	if(!(options instanceof Object)) valid = false;
	else if (!Object.keys(options).length) valid = false;
	else if (Object.keys(options).length) {
		if (!validateSpecifiedStrategies(options.strategies)) valid = false;
	}
	
	return valid;
}

function validateSpecifiedStrategies(strategiesObject) {
	var valid = true;
	strategiesObjectKeys = Object.keys(strategiesObject);
	
	strategiesObjectKeys.forEach(key => { 
		if (!(Strategies.names.filter(strategieName => strategieName === key)).length || !validateStrategyOptions(strategiesObject[key])) valid = false;
	});
	
	return valid;
}

function validateStrategyOptions(options) {
	var valid = true;
	
	if (
		!(options instanceof Object) ||
		(typeof options.breakSentence === "undefined" || typeof options.wholeSentence === "undefined" || typeof options.weight === "undefined") ||
		!!weightValueValidator(options.weight) ||
		options.breakSentence === options.wholeSentence
	) valid = false;
	
	return valid;
}