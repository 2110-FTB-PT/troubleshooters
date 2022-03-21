// takes a string, changes the first letter of every word to be capitalized, then returns a new string
export const capitalizeFirstLetter = (wordsToCapitalize) => {
  const capitalizedString = wordsToCapitalize.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');

  return capitalizedString;
}