const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const chartCtx = document.getElementById('chart');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveAndRender() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions();
  renderChart();
  updateBalance();
}

function updateBalance() {
  const total = transactions.reduce((acc, t) =>
    t.type === 'income' ? acc + +t.amount : acc - +t.amount, 0
  );
  balanceDisplay.textContent = `Balance: ₹${total}`;
}

function renderTransactions() {
  list.innerHTML = '';
  transactions.forEach(t => {
    const li = document.createElement('li');
    li.className = `transaction ${t.type}`;
    li.innerHTML = `₹${t.amount} - ${t.category} <button onclick="deleteTransaction('${t.id}')">❌</button>`;
    list.appendChild(li);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const type = document.getElementById('type').value;

  if (amount && category) {
    transactions.unshift({
      id: Date.now().toString(),
      amount,
      category,
      type
    });
    form.reset();
    saveAndRender();
  }
});

let chart;
function renderChart() {
  const income = transactions.filter(t => t.type === 'income')
    .reduce((acc, t) => acc + +t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + +t.amount, 0);

  if (chart) chart.destroy();
  chart = new Chart(chartCtx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Initialize
saveAndRender();
