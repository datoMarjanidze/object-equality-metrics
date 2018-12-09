module.exports = value => {
	var err = null;
	
    if (typeof value !== "number") err = "\`weight\` must be typeof number.";
    if (value < 0 | value > 1) err = `\`weight\` can not be ${value}. It must be in [0, 1] interval.`;
	
	return err;
}