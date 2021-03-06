import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, removeLoader } from './views/base';

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
        recipeView.removeRecipe();
        renderLoader(elements.recipe);
        if (state.search) {
            searchView.toggleHighlight(id);
        } 

        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();

            state.recipe.parseIngredients();
            state.recipe.calculateServings();
            state.recipe.calculateCookingTime();

            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            alert('Error processing recipe: ' + error);
            console.log(error.stack);
        } finally {
            removeLoader();
        }
    }
};

['hashchange', 'load'].forEach(event => { window.addEventListener(event, controlRecipe); });

/** 
 * LIST CONTROLLER
*/
const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;
    
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.removeItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value);
        state.list.updateCount(id, value);
    }
});

/** 
 * LIKES CONTROLLER
*/
const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }
    const id = state.recipe.id;
    if (!state.likes.isLiked(id)) {
        const like = state.likes.addLike(
            id, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );

        likesView.toggleLikeButton(true);
        likesView.renderLike(like);
    } else {
        state.likes.deleteLike(id);
        likesView.toggleLikeButton(false);
        likesView.removeLike(id);
    }
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.restore();
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    });
});

elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});