// Run -> node chef1.js

const myMap = {
  availableIng: [],
  count: {'FAT': 0, 'FIBER': 0, 'CARB': 0}
};

function main(numberOfDays, ingredients) {

  // console.log('ingredients------>', ingredients);

  let resultString = '';

  const fatRegex = /^FAT/,
    fiberRegex = /^FIBER/,
    carbRegex = /^CARB/;

  let searchFlag = 'BOTH';


  for(let index = 0; index < ingredients.length; index++) {
    const ingredient = ingredients[index];
    if(fatRegex.test(ingredient)) {
      myMap.count['FAT'] += 1;
      myMap.availableIng.push('FAT');
    } else if(fiberRegex.test(ingredient)) {
      myMap.count['FIBER'] += 1;
      myMap.availableIng.push('FIBER');
    } else if(carbRegex.test(ingredient)) {
      myMap.count['CARB'] += 1;
      myMap.availableIng.push('CARB');
    }

    // console.log('myMap------->', myMap);

    if(searchFlag == 'BOTH') {

      if (ifXDishPossible()){
        resultString += 'X';
        searchFlag = 'Y';

        myMap.count['FAT'] -= 2;
        //myMap.count['FIBER'] -= 2;

        removeXDishIngredients(myMap.availableIng, myMap.count);
        continue;

      }

      if (ifYDishPossible()){
        resultString += 'Y';
        searchFlag = 'X';

        myMap.count['CARB'] -= 1;
        myMap.count['FIBER'] -= 1;

        removeYDishIngredients(myMap.availableIng, myMap.count);
        continue;
      }

      resultString += '-';
      continue;

    } else if(searchFlag == 'X'){

      if(ifXDishPossible()) {
        resultString += 'X';
        searchFlag = 'Y';

        // remove first 2 fat and first 2 fiber
        myMap.count['FAT'] -= 2;
        //myMap.count['FIBER'] -= 2;

        removeXDishIngredients(myMap.availableIng, myMap.count);
        continue;
      }

      resultString += '-';
      continue;
    } else if(searchFlag == 'Y'){

      if(ifYDishPossible()) {
        resultString += 'Y';
        searchFlag = 'X';

        myMap.count['CARB'] -= 1;
        myMap.count['FIBER'] -= 1;

        removeYDishIngredients(myMap.availableIng, myMap.count);
        continue;
      }

      resultString += '-';
      continue;
    }
  }

  console.log('resultString: ', resultString);
}

function ifXDishPossible() {
  return (
    (
      myMap.count['FAT'] >= 2 && myMap.count['FIBER'] >= 2)
    || (myMap.count['FAT'] >= 3 && myMap.count['FIBER'] >= 1)
    || (myMap.count['FAT'] >= 4)
  );
}


function ifYDishPossible() {
  return (
    (myMap.count['CARB'] >= 2 && myMap.count['FIBER'] >= 2)
    || (myMap.count['CARB'] >= 3 && myMap.count['FIBER'] >= 1)
    || (myMap.count['CARB'] >= 1 && myMap.count['FIBER'] >= 3)
  );
}


function removeXDishIngredients(availableIngArray, count) {

  removeIng(availableIngArray, 'FAT');
  removeIng(availableIngArray, 'FAT');


  const idx = availableIngArray.findIndex((element) => (element !== 'CARB'));
  myMap.count[availableIngArray[idx]] -= 1;
  availableIngArray.splice(idx,1);

  const idx1 = availableIngArray.findIndex((element) => (element !== 'CARB'));
  myMap.count[availableIngArray[idx1]] -= 1;
  availableIngArray.splice(idx1,1);
}

function removeYDishIngredients(availableIngArray, count) {
  removeIng(availableIngArray, 'FIBER');
  removeIng(availableIngArray, 'CARB');

  const idx = availableIngArray.findIndex((element) => (element !== 'FAT'));
  myMap.count[availableIngArray[idx]] -= 1;
  availableIngArray.splice(idx,1);

  const idx1 = availableIngArray.findIndex((element) => (element !== 'FAT'));
  myMap.count[availableIngArray[idx1]] -= 1;
  availableIngArray.splice(idx1,1);
}


function removeIng(arrayToRemoveFrom, elementToRemove) {
  //console.log('removeIng:arrayToRemoveFrom----->', arrayToRemoveFrom, elementToRemove);
  const index = arrayToRemoveFrom.indexOf(elementToRemove);
  arrayToRemoveFrom.splice(index, 1);
  //console.log('AFTER::removeIng:arrayToRemoveFrom----->', arrayToRemoveFrom, index);
}


// numberOfDays = 9;
// ingredients = 'FATOil FIBERSpinach CARBRice FATCheese FIBERBeans FATOlive CARBPotato FIBERBroccoli FIBERBanana'.split(' ');
// //----X---Y
// console.log('Expected: ----X---Y');
// main(numberOfDays, ingredients);

// numberOfDays = 13;
// ingredients = 'CARBBeetroot FIBERCarrot FATOlive CARBCorn CARBPotato FIBERBroccoli FATEgg FIBERBeans FATCheese CARBRice FIBERSpinach FATOil FIBERBanana'.split(' ');
// //----Y--X-----
// console.log('Expected: ----Y--X-----');
// main(numberOfDays, ingredients);

// numberOfDays = 8;
// ingredients = 'FATOil FATCheese FATEgg FATGhee FIBERSpinach CARBRice FIBERBeans CARBWheat'.split(' ');
// //---X---Y
// console.log('Expected: ---X---Y');
// main(numberOfDays, ingredients);

// numberOfDays = 14;
// ingredients = 'FATOil FIBERSpinach CARBRice FATCheese FIBERBeans FATEgg FIBERBroccoli CARBPotato CARBCorn FATOlive FIBERCarrot FATGhee CARBBeetroot FIBERAlmond'.split(' ');
// //----X---Y--X--
// console.log('Expected: ----X---Y--X--');
// main(numberOfDays, ingredients);

numberOfDays = 16;
ingredients = 'CARBWheat CARBQuinoa CARBOat FATOil FIBERSpinach CARBRice FATCheese FIBERBeans FATEgg FIBERBroccoli CARBPotato CARBCorn FATOlive FIBERCarrot CARBBeetroot FIBERBanana'.split(' ');
//----Y---X--Y----
console.log('Expected: ----Y---X--Y----');
main(numberOfDays, ingredients);
