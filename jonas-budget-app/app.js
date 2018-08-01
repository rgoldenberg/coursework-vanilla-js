var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    return {
        addItem: function(type, description, value) {
            var id;
            if (data.items[type].length === 0) {
                id = 0;
            } else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }

            var item;
            if (type === 'exp') {
                item = new Expense(id, description, value);
            } else {
                item = new Income(id, description, value);
            }
            data.items[type].push(item);
            return item;
        },
        test: function() {
            console.log(data);
        }
    };

})();


var UIController = (function() {

    var DOMConstants = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    return {
        getInput: function() {        
            return {
                type: document.querySelector(DOMConstants.inputType).value,
                description: document.querySelector(DOMConstants.inputDescription).value,
                value: document.querySelector(DOMConstants.inputValue).value
            };
        },

        addItem: function(type, item) {
            var template, container;
            if (type === 'inc') {
                container = DOMConstants.incomeContainer;
                template = '<div class="item" id="income-%id%"><div class="item__description">%description%</div><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            } else {
                container = DOMConstants.expenseContainer;
                template = '<div class="item" id="expense-%id%"><div class="item__description">%description%</div><div class="item__value">- %value%</div><divclass="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }
            var html = template.replace('%id%', item.id);
            html = html.replace('%description%', item.description);
            html = html.replace('%value%', item.value);

            document.querySelector(container).insertAdjacentHTML('beforeend', html);
        },

        getDOMConstants: function() {
            return DOMConstants;
        }
    };
})();




var appController = (function(budget, ui) {

    var setUpEventListeners = function() {
        document.querySelector(ui.getDOMConstants().inputBtn).addEventListener('click', addItem);

        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addItem();
            }
        });
    };

    var addItem = function() {
        var input = ui.getInput();
        var item = budget.addItem(input.type, input.description, input.value);
        ui.addItem(input.type, item);
        // TODO
        // add to UI, 
        // calc the budget, 
        // display new budget
    };

    return {
        init: function() {
            console.log("starting application");
            setUpEventListeners();
        }
    };
})(budgetController, UIController);


appController.init();