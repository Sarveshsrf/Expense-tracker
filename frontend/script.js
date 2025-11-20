// Frontend script - connects to backend API by default
const API_BASE = 'http://localhost:5000/api'; // change if backend runs elsewhere
const STORAGE_KEY = 'expense-tracker-transactions-v1'

let transactions = [];

// DOM refs
const form = document.getElementById('transaction-form')
const typeEl = document.getElementById('type')
const amountEl = document.getElementById('amount')
const categoryEl = document.getElementById('category')
const dateEl = document.getElementById('date')
const noteEl = document.getElementById('note')
const txList = document.getElementById('transactions-list')
const balanceEl = document.getElementById('balance')
const incomeEl = document.getElementById('income')
const expenseEl = document.getElementById('expense')
const filterMonth = document.getElementById('filter-month')
const filterCategory = document.getElementById('filter-category')
const exportBtn = document.getElementById('export-csv')
const chartCanvas = document.getElementById('categoryChart')

// Helpers
const formatCurrency = n => '₹' + Number(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})

async function fetchTransactions(){
  try{
    const res = await fetch(`${API_BASE}/transactions`);
    if(!res.ok) throw new Error('Failed to fetch');
    transactions = await res.json();
    // normalize id field if needed
    transactions = transactions.map(t => ({...t, id: t._id || t.id}));
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
  }catch(err){
    console.error('Fetch failed', err);
    // fallback to localStorage if backend unreachable
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    transactions = local;
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
  }
}

function uid(){return Date.now().toString(36) + Math.random().toString(36).slice(2,7)}

function renderList(){
  txList.innerHTML = ''
  const monthFilter = filterMonth.value
  const catFilter = filterCategory.value

  const list = transactions.filter(t => {
    if(monthFilter !== 'all'){
      const [y,m] = monthFilter.split('-')
      const td = new Date(t.date)
      if(td.getFullYear() !== +y || (td.getMonth()+1) !== +m) return false
    }
    if(catFilter !== 'all' && t.category !== catFilter) return false
    return true
  })

  list.slice().reverse().forEach(t => {
    const li = document.createElement('li')
    li.className = 'tx ' + (t.type === 'expense' ? 'expense' : 'income')
    li.innerHTML = `
      <div class="left">
        <div class="meta">
          <strong>${t.category}</strong>
          <div class="small muted">${(new Date(t.date)).toISOString().slice(0,10)} • ${t.note || ''}</div>
        </div>
      </div>
      <div>
        <div class="amount">${t.type === 'expense' ? '-' : ''}${formatCurrency(t.amount)}</div>
        <div class="small">
          <button data-id="${t.id}" class="edit">Edit</button>
          <button data-id="${t.id}" class="delete">Delete</button>
        </div>
      </div>
    `
    txList.appendChild(li)
  })
}

function calcSummaries(){
  const income = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const expense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
  const balance = income - expense
  balanceEl.textContent = formatCurrency(balance)
  incomeEl.textContent = formatCurrency(income)
  expenseEl.textContent = formatCurrency(expense)
}

function rebuildFilters(){
  const months = Array.from(new Set(transactions.map(t => {
    const d = new Date(t.date)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
  }))).sort().reverse()
  filterMonth.innerHTML = '<option value="all">All months</option>' + months.map(m=>`<option value="${m}">${m}</option>`).join('')

  const cats = Array.from(new Set(transactions.map(t => t.category))).sort()
  filterCategory.innerHTML = '<option value="all">All categories</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('')
}

// API calls
async function addTransactionAPI(payload){
  try{
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Create failed');
    const created = await res.json();
    transactions.unshift({...created, id: created._id});
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
  }catch(err){
    console.error(err); alert('Add failed; saved locally instead');
    // fallback: save locally
    payload.id = uid();
    transactions.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
  }
}

async function updateTransactionAPI(id, updates){
  try{
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(updates)
    });
    if(!res.ok) throw new Error('Update failed');
    const updated = await res.json();
    transactions = transactions.map(t => (t.id === (updated._id || updated.id)) ? {...updated, id: updated._id || updated.id} : t);
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
  }catch(err){
    console.error(err); alert('Update failed');
  }
}

async function removeTransactionAPI(id){
  try{
    const res = await fetch(`${API_BASE}/transactions/${id}`, { method:'DELETE' });
    if(!res.ok) throw new Error('Delete failed');
    transactions = transactions.filter(t => t.id !== id);
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
  }catch(err){
    console.error(err); alert('Delete failed');
  }
}

// Form submit
form.addEventListener('submit', e =>{
  e.preventDefault()
  const payload = {
    type: typeEl.value,
    amount: parseFloat(amountEl.value),
    category: categoryEl.value.trim() || 'Uncategorized',
    date: dateEl.value,
    note: noteEl.value.trim()
  }
  addTransactionAPI(payload)
  form.reset()
  dateEl.value = new Date().toISOString().slice(0,10)
})

// Edit & Delete using event delegation
txList.addEventListener('click', e =>{
  if(e.target.matches('.delete')){
    const id = e.target.dataset.id
    if(confirm('Delete this transaction?')) removeTransactionAPI(id)
  }
  if(e.target.matches('.edit')){
    const id = e.target.dataset.id
    const t = transactions.find(x=>x.id===id)
    if(!t) return
    typeEl.value = t.type
    amountEl.value = t.amount
    categoryEl.value = t.category
    dateEl.value = (new Date(t.date)).toISOString().slice(0,10)
    noteEl.value = t.note
    // remove old locally (will be replaced on save)
    transactions = transactions.filter(x => x.id !== id)
    rebuildFilters(); renderList(); calcSummaries(); drawChart();
    // Optionally call API to delete then re-add on save, or better: use update flow if you want
  }
})

// Filters
filterMonth.addEventListener('change', ()=>{ renderList() })
filterCategory.addEventListener('change', ()=>{ renderList() })

// Export (open backend export)
exportBtn.addEventListener('click', ()=>{
  window.open(`${API_BASE}/export`, '_blank');
})

// Simple category chart (vanilla canvas)
function drawChart(){
  const ctx = chartCanvas.getContext('2d')
  ctx.clearRect(0,0,chartCanvas.width,chartCanvas.height)
  const expenseByCat = {}
  transactions.filter(t=>t.type==='expense').forEach(t=>{ expenseByCat[t.category] = (expenseByCat[t.category]||0) + Number(t.amount) })
  const cats = Object.keys(expenseByCat)
  if(!cats.length) return
  const vals = cats.map(c=>expenseByCat[c])
  const max = Math.max(...vals)
  const pad = 30
  const chartW = chartCanvas.width - pad*2
  const barW = chartW / cats.length * 0.6
  cats.forEach((c,i)=>{
    const x = pad + i*(chartW/cats.length) + (chartW/cats.length - barW)/2
    const h = (vals[i]/max) * (chartCanvas.height - 60)
    const y = chartCanvas.height - pad - h
    ctx.fillStyle = `hsl(${(i*55) % 360} 60% 50%)`
    ctx.fillRect(x, y, barW, h)
    ctx.fillStyle = '#000'
    ctx.font = '12px sans-serif'
    ctx.fillText(c, x, chartCanvas.height - 8)
  })
}

// bootstrap
(function init(){
  dateEl.value = new Date().toISOString().slice(0,10)
  fetchTransactions();
})();
