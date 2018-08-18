import axios from 'axios';

const PROXY = 'https://cors-anywhere.herokuapp.com/'
const KEY = '252ea33a1bbad61996585642b1d4a2e4';

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