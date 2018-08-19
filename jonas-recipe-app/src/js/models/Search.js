import axios from 'axios';
import {KEY, PROXY} from '../config';

export default class Search {

    constructor(query) {
        this.query = query;
    }

    async execute() {
        try {
            const res = await axios(`${PROXY}http://food2fork.com/api/search?key=${KEY}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}