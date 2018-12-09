module.exports = (stringOne, stringTwo) => {
	if(stringOne.length == 0) return stringTwo.length;
  if(stringTwo.length == 0) return stringOne.length;

	var matrix = [];
	
	for (let i = 0; i <= stringTwo.length; i++) matrix[i] = [i];
	
	for (let j = 0; j <= stringOne.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= stringTwo.length; i++) {
    for (let j = 1; j <= stringOne.length; j++) {
      if(stringTwo.charAt(i - 1) == stringOne.charAt(j - 1))
				matrix[i][j] = matrix[i - 1][j - 1];
			else
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
												Math.min(matrix[i][j - 1] + 1, // insertion
													matrix[i - 1][j] + 1)); // deletion
    }
  }

  return matrix[stringTwo.length][stringOne.length];
};