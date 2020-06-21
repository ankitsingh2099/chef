const fs = require('fs');
const _ = require('lodash'); 
const chef = {};
  
// Use fs.readFile() method to read the file 


chef.readFile = async (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', function(err, data){ 
      const ipData = data.split('\n');
      const ingredients = ipData[1].split(' ');
      resolve({ingredients});
    });
  })
};

chef.perform = async (fileName) => {
  const { ingredients } = await chef.readFile(fileName);
  // console.log('ingredients', ingredients);
  let resultString = '';
  const fatRegex = /^FAT/;
  const fiberRegex = /^FIBER/;
  const carbRegex = /^CARB/;
  let searchFlag = 'BOTH';
  const nutrientHash = _.reduce(ingredients, (acc, ingredient) => {
    // console.log('ingredient', ingredient);
    if (fatRegex.test(ingredient)){
      acc.count['FAT'] += 1;
      acc.availableIng.push('FAT');
    } else if (fiberRegex.test(ingredient)){
      acc.count['FIBER'] += 1;
      acc.availableIng.push('FIBER');
    }else if (carbRegex.test(ingredient)){
      acc.count['CARB'] += 1;
      acc.availableIng.push('CARB');
    }
    if (searchFlag === 'BOTH') {
      // search X
      if (chef.isXDishPossible(acc.count)){
        resultString += 'X';
        searchFlag = 'Y';
        acc.count['FAT'] -= 2;
        acc.count['FIBER'] -= 2;
        chef.removeXDishIngredeints(acc.availableIng);
        return acc;
      }
      if (chef.isYDishPossible(acc.count)){
        resultString += 'Y';
        searchFlag = 'X';
        acc.count['CARB'] -= 1;
        acc.count['FIBER'] -= 1;
        chef.removeYDishIngredeints(acc.availableIng, acc.count);
        return acc;
      }
      resultString += '-';
      return acc;
    } else if (searchFlag === 'X') {
      // search if x is possible
      // if yes print x and set flag to Y
      if (chef.isXDishPossible(acc.count)){
        resultString += 'X';
        searchFlag = 'Y';
        // remove first 2 fat and first 2 fiber
        acc.count['FAT'] -= 2;
        acc.count['FIBER'] -= 2;
        chef.removeXDishIngredeints(acc.availableIng);
        return acc;
      }
      resultString += '-';
      return acc;
    } else if (searchFlag === 'Y') {
      // search if y is possible
      // if yes print y and set flag to X
      if (chef.isYDishPossible(acc.count)){
        resultString += 'Y';
        searchFlag = 'X';
        acc.count['CARB'] -= 1;
        acc.count['FIBER'] -= 1;
        chef.removeYDishIngredeints(acc.availableIng, acc.count);
        return acc;
        // remove first fiber first carb .. then remove first 2 elements
      }
      resultString += '-';
      return acc;
    }
  }, {availableIng: [], count: {'FAT': 0, 'FIBER': 0, 'CARB': 0}})
  console.log('resultString=>', resultString)
};

chef.isXDishPossible = (nutrientObj) => {
  return (nutrientObj['FAT'] >= 2 && nutrientObj['FIBER'] >= 2) 
}

chef.isYDishPossible = (nutrientObj) => {

  return ((nutrientObj['CARB'] >= 2 && nutrientObj['FIBER'] >= 2)
    ||(nutrientObj['CARB'] >= 3 && nutrientObj['FIBER'] >= 1)
    ||(nutrientObj['CARB'] >= 1 && nutrientObj['FIBER'] >= 3))
}

chef.removeXDishIngredeints = (ingredientsArray) => {
  chef.removeIng(ingredientsArray, 'FAT');
  chef.removeIng(ingredientsArray, 'FAT');
  chef.removeIng(ingredientsArray, 'FIBER');
  chef.removeIng(ingredientsArray, 'FIBER');
}

chef.removeYDishIngredeints = (ingredientsArray, count) => {
  chef.removeIng(ingredientsArray, 'FIBER');
  chef.removeIng(ingredientsArray, 'CARB');
  const idx = _.findIndex(ingredientsArray, (element) => (element !== 'FAT'));
  count[ingredientsArray[idx]] -= 1;
  ingredientsArray.splice(idx,1);
  const idx1 = _.findIndex(ingredientsArray, (element) => (element !== 'FAT'));
  count[ingredientsArray[idx1]] -= 1;
  ingredientsArray.splice(idx1,1);
}

chef.removeIng = (arrayToRemoveFrom, elementToRemove) => {
  const idx = _.findIndex(arrayToRemoveFrom, (element) => (element === elementToRemove));
  arrayToRemoveFrom.splice(idx, 1);
}

module.exports = chef;
