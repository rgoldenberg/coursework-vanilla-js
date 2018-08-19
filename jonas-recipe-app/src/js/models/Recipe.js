import axios from 'axios';
import {KEY, PROXY} from '../config';

const UNIT_MAP = new Map(
    [
        ['tablespoons', 'tbsp'], ['tablespoon', 'tbsp'],
        ['ounces', 'oz'], ['ounce', 'oz'],
        ['teaspoons', 'tsp'], ['teaspoon', 'tsp'],
        ['cups', 'cup'], ['pounds', 'pound']
    ]
);

export default class Recipe {

    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${PROXY}http://food2fork.com/api/get?key=${KEY}&rId=${this.id}`);
            
            const recipeData = result.data.recipe; 
            this.title = recipeData.title;
            this.author = recipeData.publisher;
            this.img = recipeData.image_url;
            this.ingredients = recipeData.ingredients;
        } catch (error) {
            alert(error);
        }
    }

    /**
     * time is 15 minutes for every 3 ingredients
     */
    calculateCookingTime() {
        const intervals = Math.ceil(this.ingredients.length / 3);
        this.time = intervals * 15;
    }

    calculateServings() {
        // convenient, isn't it?
        this.servings = 4;
    }

    parseIngredients() {
        const parsedIngredients = this.ingredients.map(item => {
            let ingredient = item.toLowerCase();
            UNIT_MAP.forEach((short, full) => {
                ingredient = ingredient.replace(full, short);
            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            const ingredientArray = ingredient.split(' ');
            const unitIndex = ingredientArray.findIndex(el => Array.from(UNIT_MAP.values()).includes(el));

            let ingredientObject;
            if (unitIndex > -1) {
                // unit was found
                const countArray = ingredientArray.slice(0, unitIndex);
                let count;
                if (countArray.length === 1) {
                    count = eval(ingredientArray[0].replace('-', '+'));
                } else {
                    count = eval(countArray.join('+'));
                }

                ingredientObject = {
                    count,
                    unit: ingredientArray[unitIndex],
                    ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(ingredientArray[0])) {
                // no unit found, but ingredient description starts with a number
                ingredientObject = {
                    count: parseInt(ingredientArray[0]),
                    unit: '',
                    ingredient: ingredientArray.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                // no unit and no number at idx 0
                ingredientObject = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return ingredientObject;
        });

        this.ingredients = parsedIngredients;
    }
}