var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        budget: 0,
        percentage: -1,
        items: {
            exp: [],
            inc: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.items[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
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

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.items[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.items[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.items.exp.forEach(function(current) {
                current.calculatePercentage(data.totals.inc);
            });
        },

        getPercentages() {
            return data.items.exp.map(function(current) {
                return current.getPercentage();
            });
        },

        getBudget: function() {
            return {
                totalBudget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        deleteParent: '.container',
        expensePercentageLabel: '.item__percentage'
    };

    return {
        getInput: function() {        
            return {
                type: document.querySelector(DOMConstants.inputType).value,
                description: document.querySelector(DOMConstants.inputDescription).value,
                value: parseFloat(document.querySelector(DOMConstants.inputValue).value)
            };
        },

        addItem: function(type, item) {
            var template, container;
            if (type === 'inc') {
                container = DOMConstants.incomeContainer;
                template = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            } else {
                container = DOMConstants.expenseContainer;
                template = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="item__value">- %value%</div><div class="item__percentage">2%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }
            var html = template.replace('%id%', item.id);
            html = html.replace('%description%', item.description);
            html = html.replace('%value%', item.value);

            document.querySelector(container).insertAdjacentHTML('beforeend', html);
        },

        deleteItem: function(id) {
            var target = document.getElementById(id);
            target.parentNode.removeChild(target);
        },

        resetFields: function() {
            var fields = document.querySelectorAll(DOMConstants.inputDescription + ', ' + DOMConstants.inputValue)
            var fieldArray = Array.prototype.slice.call(fields);
            fieldArray.forEach(function(field) {
                field.value = '';
            });
            fieldArray[0].focus();
        },

        displayBudget: function(budget) {
            document.querySelector(DOMConstants.budgetLabel).textContent = budget.totalBudget;
            document.querySelector(DOMConstants.incomeLabel).textContent = budget.totalIncome;
            document.querySelector(DOMConstants.expensesLabel).textContent = budget.totalExpenses;
            if (budget.percentage > 0) {
                document.querySelector(DOMConstants.percentageLabel).textContent = budget.percentage + '%';
            } else {
                document.querySelector(DOMConstants.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            var fields = document.querySelectorAll(DOMConstants.expensePercentageLabel);
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        getDOMConstants: function() {
            return DOMConstants;
        } 
    };
})();




var appController = (function(budgetCtrl, ui) {

    var setUpEventListeners = function() {
        var constants = ui.getDOMConstants();

        document.querySelector(constants.inputBtn).addEventListener('click', addItem);

        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addItem();
            }
        });

        document.querySelector(constants.deleteParent).addEventListener('click', deleteItem);
    };

    var isValid = function(input) {
        return input.description !== '' && !isNaN(input.value) && input.value > 0;
    };

    var updateBudget = function() {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        ui.displayBudget(budget);
        console.log(budget);
        
    };

    var addItem = function() {
        var input = ui.getInput();
        if (isValid(input)) {
            var item = budgetCtrl.addItem(input.type, input.description, input.value);
            ui.addItem(input.type, item);
            ui.resetFields();
            updateBudget();
            updatePercentages();
        }
    };

    var deleteItem = function(event) {
        var itemID, type, ID;
        var itemID = event.target.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            var data = itemID.split('-');

            type = data[0];
            ID = parseInt(data[1]);

            budgetCtrl.deleteItem(type, ID);
            ui.deleteItem(itemID);

            updateBudget();
            updatePercentages();
        }
    };

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        ui.displayPercentages(percentages);
    };

    return {
        init: function() {
            console.log("starting application");
            setUpEventListeners();
            ui.displayBudget({
                totalBudget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
        }
    };

})(budgetController, UIController);


appController.init();