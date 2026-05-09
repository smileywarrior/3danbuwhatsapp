// === APP CONTROLLER ===
const pageTitles = {
  dashboard: ['Dashboard', 'Welcome back! Here\'s your WhatsApp overview'],
  billing: ['Billing & Costs', 'Track your messaging costs and payments'],
  campaigns: ['Campaigns', 'Create and manage message campaigns'],
  contacts: ['Contacts', 'Manage your WhatsApp contacts']
};

let currentPage = 'dashboard';

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  document.getElementById('pageTitle').textContent = pageTitles[page][0];
  document.getElementById('pageSubtitle').textContent = pageTitles[page][1];
  const container = document.getElementById('pageContainer');
  const renderers = { dashboard: renderDashboard, billing: renderBilling, campaigns: renderCampaigns, contacts: renderContacts };
  container.innerHTML = renderers[page]();
  if (page === 'dashboard') buildChart();
  bindPageEvents(page);
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

function buildChart() {
  const el = document.getElementById('dashChart');
  if (!el) return;
  const max = Math.max(...MOCK.chartData);
  el.innerHTML = MOCK.chartData.map((v, i) => {
    const h = (v / max * 100);
    const color = i === MOCK.chartData.length - 1 ? 'var(--accent)' : 'var(--border-light)';
    return `<div class="chart-bar" style="height:${h}%;background:${color}"><span class="bar-tooltip">${v} msgs</span></div>`;
  }).join('');
}

function bindPageEvents(page) {
  if (page === 'campaigns') {
    const btn = document.getElementById('sendCampaignBtn');
    if (btn) btn.onclick = () => {
      const msg = document.getElementById('msgContent').value;
      if (!msg.trim()) { alert('Please enter a message'); return; }
      alert('Campaign sent successfully to ' + document.getElementById('msgRecipients').selectedOptions[0].text + '!');
      document.getElementById('msgContent').value = '';
    };
  }
  if (page === 'contacts') {
    const btn = document.getElementById('addContactBtn');
    if (btn) btn.onclick = showAddContactModal;
    const qBtn = document.getElementById('quickSendBtn');
    if (qBtn) qBtn.onclick = () => {
      const msg = document.getElementById('quickMsg').value;
      if (!msg.trim()) { alert('Please enter a message'); return; }
      alert('Message sent!');
      document.getElementById('quickMsg').value = '';
    };
  }
}

function showAddContactModal() {
  let overlay = document.getElementById('modalOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modalOverlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal">
    <div class="modal-header"><h2>Add New Contact</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Full Name</label><input class="form-input" id="newName" placeholder="e.g. John Doe"></div>
      <div class="form-group"><label>Phone Number</label><input class="form-input" id="newPhone" placeholder="e.g. +91 98765 43210"></div>
      <div class="form-group"><label>Group</label><select class="form-select" id="newGroup"><option>VIP</option><option>Leads</option><option>Customers</option></select></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="addContact()">Add Contact</button>
    </div>
  </div>`;
  requestAnimationFrame(() => overlay.classList.add('active'));
}

function closeModal() {
  const o = document.getElementById('modalOverlay');
  if (o) { o.classList.remove('active'); setTimeout(() => o.remove(), 300); }
}

function addContact() {
  const name = document.getElementById('newName').value.trim();
  const phone = document.getElementById('newPhone').value.trim();
  const group = document.getElementById('newGroup').value;
  if (!name || !phone) { alert('Please fill in all fields'); return; }
  MOCK.contacts.unshift({ name, phone, group });
  closeModal();
  navigateTo('contacts');
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  // Nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => { e.preventDefault(); navigateTo(item.dataset.page); });
  });
  // Mobile menu
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  });
  // Initial page
  navigateTo('dashboard');
});
