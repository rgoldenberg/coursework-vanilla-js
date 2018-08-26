import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        this.items.push({
            id: uniqid(),
            count, 
            unit,
            ingredient
        });
    }

    deleteItem(id) {
        const idx = this.items.findIndex(el => el.id === id);
        this.items.splice(idx, 1);
    }

    updateCount(id, count) {
        this.items.find(el => el.id === id).count = count;   
    }
}