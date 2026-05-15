// MAA DIGITAL - Dashboard JS

// Load all dashboard stats
function loadDashboardStats() {
  const user = Store.get('user');
  if (!user) return;
  // Wallet
  document.querySelectorAll('[data-user-wallet]').forEach(el => {
    el.textContent = '₹' + (user.wallet || '0.00');
  });
  // Name initial for avatar
  document.querySelectorAll('.user-avatar').forEach(el => {
    el.textContent = (user.name || 'M')[0].toUpperCase();
  });
}

// Order list renderer
function renderOrders(orders = []) {
  const tbody = document.getElementById('ordersBody');
  if (!tbody) return;
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📭</div><h4>Koi order nahi</h4><p>Dashboard se koi service select karein.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><span class="font-mono">${o.id}</span></td>
      <td>${o.service}</td>
      <td>${o.name}</td>
      <td>${o.date}</td>
      <td>₹${o.amount}</td>
      <td><span class="badge badge-${o.statusClass}">${o.status}</span></td>
      <td><button class="btn btn-sm btn-outline">View</button></td>
    </tr>`).join('');
}

// Wallet transaction renderer
function renderTransactions(txns = []) {
  const tbody = document.getElementById('txnBody');
  if (!tbody) return;
  if (txns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">💸</div><h4>Koi transaction nahi</h4></div></td></tr>`;
    return;
  }
  tbody.innerHTML = txns.map(t => `
    <tr>
      <td><span class="font-mono">${t.id}</span></td>
      <td>${t.type}</td>
      <td>₹${t.amount}</td>
      <td>${t.date}</td>
      <td><span class="badge badge-${t.statusClass}">${t.status}</span></td>
    </tr>`).join('');
}

// Service apply handler
function applyService(serviceName) {
  const user = Store.get('user');
  if (!user) { window.location.href = '../login.html'; return; }
  const wallet = parseFloat(user.wallet || 0);
  if (wallet <= 0) {
    alert('Wallet mein balance nahi hai! Pehle recharge karein.');
    window.location.href = 'wallet.html';
    return;
  }
  window.open('https://wa.me/919898072313?text=Mujhe ' + encodeURIComponent(serviceName) + ' chahiye. Member ID: ' + (user.id || ''), '_blank');
}

// Sidebar active link
function setActiveSidebarLink() {
  const page = location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// Sidebar toggle
function initDashboardSidebar() {
  const btn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = Store.get('user');
  if (!user) { window.location.href = '../login.html'; return; }
  loadDashboardStats();
  setActiveSidebarLink();
  initDashboardSidebar();
  initLiveTime('#liveTime');
  renderOrders(Store.get('orders') || []);
  renderTransactions(Store.get('transactions') || []);
});
