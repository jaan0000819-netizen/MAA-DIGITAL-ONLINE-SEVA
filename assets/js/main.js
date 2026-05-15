// MAA DIGITAL - Main JS
const Store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem('md_'+k)); } catch(e) { return null; } },
  set: (k,v) => localStorage.setItem('md_'+k, JSON.stringify(v)),
  remove: (k) => localStorage.removeItem('md_'+k)
};

function requireAuth() {
  const user = Store.get('user');
  if (!user) { window.location.href = '/login.html'; return null; }
  return user;
}

function requireAdmin() {
  const user = Store.get('user');
  if (!user || user.role !== 'admin') { window.location.href = '/login.html'; return null; }
  return user;
}

function logout() {
  Store.remove('user');
  window.location.href = '/login.html';
}

function showAlert(msg, type='info', container='#alertBox') {
  const icons = {success:'✅',danger:'❌',warning:'⚠️',info:'ℹ️'};
  const el = document.querySelector(container);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${icons[type]||''} ${msg}</div>`;
  setTimeout(()=>{ el.innerHTML=''; }, 4000);
}

function togglePass(inputId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function setBtnLoading(btn, loading, text='') {
  if (loading) { btn.disabled=true; btn.dataset.orig=btn.innerHTML; btn.innerHTML=`<span class="spinner">⏳</span> ${text||'Loading...'}`; }
  else { btn.disabled=false; btn.innerHTML=btn.dataset.orig||text; }
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target||el.innerText.replace(/[^0-9.]/g,''));
  const prefix = el.dataset.prefix||'';
  const suffix = el.dataset.suffix||'';
  let current = 0, step = target/60;
  const timer = setInterval(() => {
    current = Math.min(current+step, target);
    el.innerText = prefix + (Number.isInteger(target)?Math.floor(current):current.toFixed(1)) + suffix;
    if (current>=target) clearInterval(timer);
  }, 20);
}

function initLiveTime(selector='.live-time') {
  const el = document.querySelector(selector);
  if (!el) return;
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  };
  update(); setInterval(update, 1000);
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle||!menu) return;
  toggle.addEventListener('click', ()=>menu.classList.toggle('open'));
}

function initSidebarToggle() {
  const btn = document.querySelector('.sidebar-toggle-btn');
  const sidebar = document.querySelector('.sidebar,.admin-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!btn||!sidebar) return;
  btn.addEventListener('click', ()=>{
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  });
  if (overlay) overlay.addEventListener('click', ()=>{
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

function loadUserInfo() {
  const user = Store.get('user');
  if (!user) return;
  document.querySelectorAll('[data-user-name]').forEach(el=>el.textContent=user.name||'User');
  document.querySelectorAll('[data-user-id]').forEach(el=>el.textContent=user.id||'MD00000');
  document.querySelectorAll('[data-user-wallet]').forEach(el=>el.textContent='₹'+(user.wallet||'0.00'));
  document.querySelectorAll('[data-user-mobile]').forEach(el=>el.textContent=user.mobile||'');
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el=>animateCounter(el));
}

document.addEventListener('DOMContentLoaded', ()=>{
  initMobileNav();
  initSidebarToggle();
  initLiveTime();
  loadUserInfo();
  initCounters();
});
