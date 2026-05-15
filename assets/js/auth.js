// MAA DIGITAL - Auth JS
document.addEventListener('DOMContentLoaded', ()=>{
  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const mobile = document.getElementById('mobile').value.trim();
      const password = document.getElementById('password').value;
      const role = document.querySelector('input[name="role"]:checked')?.value||'member';
      const btn = loginForm.querySelector('button[type=submit]');
      if (!mobile||!password) { showAlert('Mobile aur Password required hai','danger'); return; }
      setBtnLoading(btn, true, 'Login ho raha hai...');
      await new Promise(r=>setTimeout(r,1000));
      // Demo login
      const user = { name: role==='admin'?'Admin Ji':'Member Ji', mobile, id:'MD'+Date.now().toString().slice(-5), wallet:'250.00', role };
      Store.set('user', user);
      setBtnLoading(btn, false);
      window.location.href = role==='admin' ? '../admin/index.html' : '../dashboard/index.html';
    });
  }

  // Register
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = regForm.querySelector('button[type=submit]');
      const pass = document.getElementById('password').value;
      const cpass = document.getElementById('cpassword').value;
      if (pass !== cpass) { showAlert('Password match nahi kar raha','danger'); return; }
      setBtnLoading(btn, true, 'Register ho raha hai...');
      await new Promise(r=>setTimeout(r,1200));
      showAlert('Registration successful! Login karein.','success');
      setBtnLoading(btn, false);
      setTimeout(()=>window.location.href='login.html',1500);
    });
  }

  // Role tabs
  document.querySelectorAll('.role-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.role-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const role = tab.dataset.role;
      document.querySelectorAll('input[name="role"]').forEach(r=>r.value=role);
    });
  });
});
