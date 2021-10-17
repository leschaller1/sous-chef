// counter ensures we only insert the overlay once
const counter = 0;

const getRecipeInfo = () => {
  let schemaObject;

  Array.from(document.querySelectorAll('[type="application/ld+json"]')).every((element) => {
    const { text } = element;
    if(text.includes('"@type":"Recipe"')) {
      const json = JSON.parse(text);
      if (json['@type'] === 'Recipe') {
        schemaObject = json;
      } else {
        schemaObject = json['@graph'].find(obj => {
          return obj['@type'] === 'Recipe'
        })
      }
      return false;
    }
  });

  if(schemaObject) {
    const wrap = document.createElement('div');
    wrap.className = 'sc-wrap';
    const name = document.createElement('h1');
    name.textContent = schemaObject.name;

    const secondaryInfo = document.createElement('div');
    secondaryInfo.className = 'sc-secondary-info';

    const secondaryInfoText = document.createElement('div');

    const image = document.createElement('img');
    image.src = schemaObject.image[0];

    const author = document.createElement('p');
    author.textContent = `Author: ${schemaObject.author?.name}`;

    const description = document.createElement('p');
    description.className = 'sc-description';
    description.textContent = schemaObject.description;

    const yield = document.createElement('p');
    yield.textContent = `Servings: ${schemaObject.recipeYield[0]}`;

    const prepTime = document.createElement('p');
    prepTime.textContent = `Prep time: ${schemaObject.prepTime.replace('PT', '')}`;

    const cookTime = document.createElement('p');
    cookTime.textContent = `Cook time: ${schemaObject.cookTime.replace('PT', '')}`;

    const totalTime = document.createElement('p');
    totalTime.textContent = `Total time: ${schemaObject.totalTime.replace('PT', '')}`;

    const ingredients = document.createElement('ul');
    ingredients.className = 'ingredients';

    schemaObject.recipeIngredient.forEach((ingredient) => {
      const ingredientElement = document.createElement('li');
      ingredientElement.textContent = ingredient;
      ingredients.appendChild(ingredientElement);
    })

    // instructions
    // rating

    wrap.appendChild(name);
    wrap.append(description);
    wrap.append(secondaryInfo);
    secondaryInfo.appendChild(image);
    secondaryInfo.appendChild(secondaryInfoText);
    secondaryInfoText.appendChild(author);
    secondaryInfoText.appendChild(yield);
    secondaryInfoText.appendChild(prepTime);
    secondaryInfoText.appendChild(cookTime);
    secondaryInfoText.appendChild(totalTime);
    wrap.append(ingredients);
    document.body.insertBefore(wrap, document.body.firstChild);
    document.body.style.overflow = 'hidden';
  }
}

// check the blacklist to see if we should run on this site
chrome.storage.sync.get(document.location.hostname, function (items) {
  if (!(document.location.hostname in items) && (counter === 0)) {
    getRecipeInfo();
  }
});