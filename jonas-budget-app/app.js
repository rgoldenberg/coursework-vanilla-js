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

})();


var UIController = (function() {

    var DOMConstants = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {        
            return {
                type: document.querySelector(DOMConstants.inputType).value,
                description: document.querySelector(DOMConstants.inputDescription).value,
                value: document.querySelector(DOMConstants.inputValue).value
            };
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
        // TODO  
        // add item to budget, 
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