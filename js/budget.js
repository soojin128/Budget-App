// ELEMENTS
const balanceEl = document.querySelector('.balance .value');
const incomeTotalEl = document.querySelector('.income-total');
const outcomeTotalEl = document.querySelector('.outcome-total');
const incomeEl = document.querySelector('#income');
const expenseEl = document.querySelector('#expense');
const allEl = document.querySelector('#all');
const incomeList = document.querySelector('#income .list');
const expenseList = document.querySelector('#expense .list');
const allList = document.querySelector('#all .list');

// BTNS
const expenseBtn = document.querySelector('.tab1');
const incomeBtn = document.querySelector('.tab2');
const allBtn = document.querySelector('.tab3');

// INPUT 
const addExpense = document.querySelector('.add-expense');
const expenseTitle = document.getElementById('expense-title-input');
const expenseAmount = document.getElementById('expense-amount-input');

const addIncome = document.querySelector('.add-income');
const incomeTitle = document.getElementById('income-title-input');
const incomeAmount = document.getElementById('income-amount-input');

let ENTRY_LIST;
let balance = 0,
  income = 0,
  outcome = 0;
const DELETE = 'delete',
  EDIT = 'edit';

ENTRY_LIST = JSON.parse(localStorage.getItem('entry_list')) || [];
updateUI();



// EVENT LISTENERS
expenseBtn.addEventListener('click', function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});
incomeBtn.addEventListener('click', function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener('click', function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener('click', function () {
  if (!expenseTitle.value || !expenseAmount.value) return;

  // SAVE THE ENTRY TO ENTRY_LIST
  let expense = {
    type: 'expense',
    title: expenseTitle.value,
    amount: parseInt(expenseAmount.value.replace(/,/g, ''))
  }
  ENTRY_LIST.push(expense);

  updateUI();
  clearInput([expenseTitle, expenseAmount]);
});

addIncome.addEventListener('click', function () {
  if (!incomeTitle.value || !incomeAmount.value) return;

  let income = {
    type: 'income',
    title: incomeTitle.value,
    amount: parseInt(incomeAmount.value.replace(/,/g, ''))
  }
  ENTRY_LIST.push(income);

  updateUI();
  clearInput([incomeTitle, incomeAmount]);
});

incomeList.addEventListener('click', deleteOrEdit);
expenseList.addEventListener('click', deleteOrEdit);
allList.addEventListener('click', deleteOrEdit);

// HELPERS
function deleteOrEdit(event) {
  const targetBtn = event.target.parentNode;

  const entry = targetBtn.parentNode;
  
  if (targetBtn.id == DELETE) {
    deleteEntry(entry);
  } else if (targetBtn.id == EDIT) {
    editEntry(entry);
  }
}

function deleteEntry(entry) {
  ENTRY_LIST.splice(entry.id, 1);

  updateUI();
}

function editEntry(entry) {
  entry = entry;

  let ENTRY = ENTRY_LIST[entry.id];

  if (ENTRY.type == 'income') {
    incomeAmount.value = ENTRY.amount;
    incomeTitle.value = ENTRY.title;
  } else if (ENTRY.type == 'expense') {
    expenseAmount.value = ENTRY.amount;
    expenseTitle.value = ENTRY.title;
  }
  deleteEntry(entry);
}

function updateUI() {
  income = calculateTotal('income', ENTRY_LIST);
  outcome = calculateTotal('expense', ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));
  
  updateChart(income, outcome);

  // DETERMINE SIGN OF BALANCE
  let sign = (income >= outcome) ? '' : '-';

  // ADD COMMAS
  addCommas();

  // UPDATE UI
  balanceEl.innerHTML = `<small>${sign}</small>${balance}<small>원</small>`;
  outcomeTotalEl.innerHTML = `${outcome}<small>원</small>`;
  incomeTotalEl.innerHTML = `${income}<small>원</small>`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type == 'expense') {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type == 'income') {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });
  
  localStorage.setItem('entry_list', JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
  const commaInAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  amount = commaInAmount;

  const entry = `<li id="${id}" class="${type}">
  <div class="entry">${title}: ${amount}원</div>
  <div id="edit">
  <i class="fas fa-edit"></i>
  </div>
  <div id="delete">
  <i class="fas fa-trash-alt"></i>
  </div>
  </li>`;
  const position = 'afterbegin';

  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  elements.forEach(element => {
    element.innerHTML = '';
  });
}

function addCommas(){
  const commaInIncome = income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const commaInOutcome = outcome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const commaInBalance = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  income = commaInIncome;
  outcome = commaInOutcome;
  balance = commaInBalance;
}

function calculateTotal(type, list) {
  let sum = 0;

  list.forEach(entry => {
    if (entry.type == type) {
      sum += entry.amount;
    }
  });
  return sum;
}

function clearInput(inputs) {
  inputs.forEach(input => {
    input.value = '';
  });
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function show(element) {
  element.classList.remove('hide');
}

function hide(elements) {
  elements.forEach(element => {
    element.classList.add('hide');
  });
}

function active(element) {
  element.classList.add('active');
}

function inactive(elements) {
  elements.forEach(element => {
    element.classList.remove('active');
  });
}