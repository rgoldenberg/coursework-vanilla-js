export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    resultsList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementNames = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementNames.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementNames.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};