document.getElementById('expense-form').addEventListener('submit', addExpense);
document.getElementById('filter-category').addEventListener('change', filterExpenses);

let totalAmount = 0;
let expenses = [];
let editIndex = -1;

function addExpense(event) {
    event.preventDefault();
    console.log('Add Expense button clicked');

    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    console.log('Expense Name:', name);
    console.log('Expense Amount:', amount);
    console.log('Expense Category:', category);

    if (isNaN(amount)) {
        alert('Please enter a valid amount.');
        return;
    }

    const expense = { name, amount, category, date };

    if (editIndex === -1) {
        expenses.push(expense);
        totalAmount += amount;
    } else {
        totalAmount -= expenses[editIndex].amount;
        expenses[editIndex] = expense;
        totalAmount += amount;
        editIndex = -1;
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateExpenseList(expenses);
    updateCategoryTotals();

    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    document.getElementById('expense-form').reset();
}

function updateExpenseList(expensesToDisplay) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    expensesToDisplay.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name}: ₹${expense.amount.toFixed(2)} (${expense.date}) [${expense.category}]
            <button class="edit-button" oneclick="editExpense(${index})">Edit</button>
            <button class="delete-button" onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
}

function filterExpenses() {
    const category = document.getElementById('filter-category').value;
    if (category === 'All') {
        updateExpenseList(expenses);
    } else {
        const filteredExpenses = expenses.filter(expense => expense.category === category);
        updateExpenseList(filteredExpenses);
    }
}

function updateCategoryTotals() {
    const categoryTotals = expenses.reduce((totals, expense) => {
        if (!totals[expense.category]) {
            totals[expense.category] = 0;
        }
        totals[expense.category] += expense.amount;
        return totals;
    }, {});

    const categoryTotalsList = document.getElementById('category-totals');
    categoryTotalsList.innerHTML = '';

    for (const [category, total] of Object.entries(categoryTotals)) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`${category}: ₹${total.toFixed(2)}`));
        categoryTotalsList.appendChild(li);
    }
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    editIndex = index;
}

function deleteExpense(index) {
    totalAmount -= expenses[index].amount;
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateExpenseList(expenses);
    updateCategoryTotals();
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = savedExpenses;
    totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    updateExpenseList(expenses);
    updateCategoryTotals();
});