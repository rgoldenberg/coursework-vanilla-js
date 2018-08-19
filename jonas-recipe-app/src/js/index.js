import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, removeLoader } from './views/base';
import Recipe from './models/Recipe';

/* Global state object */
const state = {};

/** 
 * SEARCH CONTROLLER
*/
const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query);

        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            await state.search.execute();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Searching for recipes went wrong: ' + error)
        } finally {
            removeLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/** 
 * RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        state.recipe = new Recipe(id);
        window.r = state.recipe; //TESTING
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calculateServings();
            state.recipe.calculateCookingTime();
        } catch (error) {
            alert('Error processing recipe: ' + error);
        }
    }
};

['hashchange', 'load'].forEach(event => { window.addEventListener(event, controlRecipe); });