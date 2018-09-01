const STORAGE_KEY = 'likes';

export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id, 
            title,
            author,
            img
        };
        this.likes.push(like);
        this.persist();
        return like;
    }

    deleteLike(id) {
        const idx = this.likes.findIndex(like => like.id === id);
        this.likes.splice(idx, 1);
        this.persist();
    }

    isLiked(id) {
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }

    // flushes the likes array to localStorage
    persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.likes));
    }

    // restores likes data from localStorage 
    restore() {
        const storedLikes = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (storedLikes) {
            this.likes = storedLikes;
        }
    }
}