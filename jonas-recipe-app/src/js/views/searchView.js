import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.resultsList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const toggleHighlight = id => {
    const links = Array.from(document.querySelectorAll('.results__link'));
    links.forEach(link => {
        link.classList.remove('results__link--active');
    });
    const resultLink = document.querySelector(`.results__link[href*="${id}"]`);
    if (resultLink) {
        resultLink.classList.add('results__link--active');
    }
};

export const trimTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((acc, current) => {
            const accumulated = acc + current.length;
            if (accumulated <= limit) {
                newTitle.push(current);
            }
            return accumulated;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup =
        `<li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${trimTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;

    elements.resultsList.insertAdjacentHTML('beforeend', markup);
};

const BUTTON_TYPE = {
    previous: 'prev',
    next: 'next'
};

const renderButton = (page, type) => {
    const targetPage = type === BUTTON_TYPE.previous ? page - 1 : page + 1;
    const direction = type === BUTTON_TYPE.previous ? 'left' : 'right';
    return `<button class="btn-inline results__btn--${type}" data-goto=${targetPage}>
                <span>Page ${targetPage}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${direction}"></use>
                </svg>
            </button>`;
}

const renderPageButtons = (page, resultsTotal, resultsPerPage) => {
    const pages = Math.ceil(resultsTotal  / resultsPerPage);
    
    let button;
    if (page === 1 && pages > 1) {
        button = renderButton(page, BUTTON_TYPE.next);
    } else if (page < pages) {
        button = `${renderButton(page, BUTTON_TYPE.previous)}
                  ${renderButton(page, BUTTON_TYPE.next)}`;
    } else if (page === pages && pages > 1) {
        button = renderButton(page, BUTTON_TYPE.previous);
    }

    if (button) {
        elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
    }
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    
    if (recipes) {
        const start = (page - 1) * resultsPerPage;
        const end = page * resultsPerPage;
        recipes.slice(start, end).forEach(renderRecipe);
        renderPageButtons(page, recipes.length, resultsPerPage);
    }
};