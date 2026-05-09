// === PAGE RENDERERS ===
function renderDashboard() {
  const d = MOCK;
  return `
  <div class="payment-banner animate-in">
    <div class="banner-icon"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v4M11 16v4M4.93 4.93l2.83 2.83M14.24 14.24l2.83 2.83M2 11h4M16 11h4M4.93 17.07l2.83-2.83M14.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
    <div class="banner-text">
      <h3>⏰ Payment Due in ${d.daysToPayment} Days</h3>
      <p>Your next billing cycle ends on May 15, 2026 · Current usage: $${d.monthlyTotal.toFixed(2)}</p>
    </div>
    <button class="banner-action" onclick="navigateTo('billing')">Pay Now</button>
  </div>
  <div class="stats-grid">
    <div class="stat-card green animate-in delay-1">
      <div class="stat-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4-6h4l4 6-4 6H8L4 10z" stroke="currentColor" stroke-width="1.5"/><path d="M10 7v3l2 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="stat-value">${d.stats.sent.toLocaleString()}</div>
      <div class="stat-label">Messages Sent</div>
      <div class="stat-change up">↑ 12.5%</div>
    </div>
    <div class="stat-card blue animate-in delay-2">
      <div class="stat-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10l-4 6H8L4 10l4-6h4l4 6z" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/></svg></div>
      <div class="stat-value">${d.stats.received.toLocaleString()}</div>
      <div class="stat-label">Messages Received</div>
      <div class="stat-change up">↑ 8.3%</div>
    </div>
    <div class="stat-card purple animate-in delay-3">
      <div class="stat-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10a7 7 0 1114 0 7 7 0 01-14 0z" stroke="currentColor" stroke-width="1.5"/><path d="M10 7v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="stat-value">${d.stats.delivered.toLocaleString()}</div>
      <div class="stat-label">Delivered</div>
      <div class="stat-change up">↑ 96.1%</div>
    </div>
    <div class="stat-card orange animate-in delay-4">
      <div class="stat-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4M10 13v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="stat-value">${d.stats.contacts.toLocaleString()}</div>
      <div class="stat-label">Total Contacts</div>
      <div class="stat-change up">↑ 5.2%</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="panel animate-in">
      <div class="panel-header"><span class="panel-title"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12V4l6 4 6-4v8" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Message Traffic (30 Days)</span></div>
      <div class="panel-body"><div class="chart-area"><div class="chart-bars" id="dashChart"></div></div></div>
    </div>
    <div class="panel animate-in">
      <div class="panel-header"><span class="panel-title"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.35 4.76 5.25.77-3.8 3.7.9 5.23L8 13.27l-4.7 2.47.9-5.24-3.8-3.7 5.25-.76L8 1z" stroke="var(--orange)" stroke-width="1.3" stroke-linejoin="round"/></svg> Customer Feedback</span></div>
      <div class="panel-body">
        ${d.feedback.map(f => `<div class="feedback-item"><div class="feedback-header"><span class="feedback-name">${f.name}</span><span class="feedback-rating">${stars(f.rating)}</span></div><p class="feedback-text">${f.text}</p></div>`).join('')}
      </div>
    </div>
  </div>
  <div class="panel animate-in">
    <div class="panel-header"><span class="panel-title"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 8h12M2 13h12" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round"/></svg> Recent Messages</span></div>
    <div class="panel-body" style="padding:0;">
      <table class="data-table"><thead><tr><th>Recipient</th><th>Type</th><th>Status</th><th>Time</th></tr></thead><tbody>
        ${d.recentMessages.map(m => `<tr><td style="color:var(--text-primary);font-weight:600">${m.to}</td><td><span class="tag ${m.type}">${m.type}</span></td><td>${m.status === 'failed' ? '<span style="color:var(--red)">● Failed</span>' : m.status === 'read' ? '<span style="color:var(--accent)">● Read</span>' : '<span style="color:var(--blue)">● ' + m.status.charAt(0).toUpperCase() + m.status.slice(1) + '</span>'}</td><td>${m.time}</td></tr>`).join('')}
      </tbody></table>
    </div>
  </div>`;
}

function renderBilling() {
  const c = MOCK.costs, total = MOCK.monthlyTotal;
  const items = [
    { label: 'Marketing', color: 'var(--purple)', ...c.marketing },
    { label: 'Utility', color: 'var(--blue)', ...c.utility },
    { label: 'Campaign', color: 'var(--accent)', ...c.campaign },
    { label: 'Authentication', color: 'var(--cyan)', ...c.auth }
  ];
  const circumference = 2 * Math.PI * 60;

  let offset = 0;
  const arcs = items.map(it => {
    const pct = it.total / total;
    const dash = pct * circumference;
    const o = offset;
    offset += dash;
    return `<circle cx="80" cy="80" r="60" fill="none" stroke="${it.color}" stroke-width="18" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="-${o}" opacity="0.85"/>`;
  });

  return `
  <div class="grid-2">
    <div>
      <div class="summary-box animate-in" style="margin-bottom:16px">
        <div class="total-label">Total This Month</div>
        <div class="total-value">$${total.toFixed(2)}</div>
        <div class="total-period">May 1 – May 31, 2026</div>
        <button class="btn btn-primary" style="margin-top:16px" onclick="alert('Payment gateway integration coming soon!')">💳 Pay Now</button>
      </div>
      <div class="panel animate-in">
        <div class="panel-header"><span class="panel-title">Cost Breakdown</span></div>
        <div class="panel-body">
          ${items.map(it => `<div class="cost-item"><div class="cost-label"><span class="cost-dot" style="background:${it.color}"></span><span>${it.label} <span style="color:var(--text-muted);font-size:11px">(${it.count.toLocaleString()} msgs × $${it.rate})</span></span></div><div class="cost-value">$${it.total.toFixed(2)}</div></div>`).join('')}
        </div>
      </div>
    </div>
    <div>
      <div class="panel animate-in" style="margin-bottom:16px">
        <div class="panel-header"><span class="panel-title">Usage Distribution</span></div>
        <div class="panel-body" style="text-align:center">
          <div class="donut-chart"><svg width="160" height="160" viewBox="0 0 160 160">${arcs.join('')}</svg><div class="donut-center"><span class="dc-value">${(c.marketing.count+c.utility.count+c.campaign.count+c.auth.count).toLocaleString()}</span><span class="dc-label">Total Msgs</span></div></div>
          <div class="chart-legend">
            ${items.map(it => `<div class="legend-item"><span class="legend-dot" style="background:${it.color}"></span><span>${it.label}</span><span class="legend-value">${(it.total/total*100).toFixed(1)}%</span></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="panel animate-in">
        <div class="panel-header"><span class="panel-title">Billing History</span></div>
        <div class="panel-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead><tbody>
            ${MOCK.billingHistory.map(b => `<tr><td style="font-weight:600;color:var(--text-primary)">${b.month}</td><td style="font-family:'JetBrains Mono',monospace">$${b.amount.toFixed(2)}</td><td><span class="tag campaign">${b.status}</span></td></tr>`).join('')}
          </tbody></table>
        </div>
      </div>
    </div>
  </div>`;
}

function renderCampaigns() {
  return `
  <div class="grid-2">
    <div class="panel animate-in">
      <div class="panel-header"><span class="panel-title"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3l6 4 6-4v10H2V3z" stroke="var(--accent)" stroke-width="1.3"/></svg> Send Campaign Message</span></div>
      <div class="panel-body">
        <div class="form-group"><label>Message Type</label><select class="form-select" id="msgType"><option value="campaign">Campaign</option><option value="marketing">Marketing</option><option value="utility">Utility</option></select></div>
        <div class="form-group"><label>Recipients</label><select class="form-select" id="msgRecipients"><option value="all">All Contacts (${MOCK.contacts.length})</option><option value="vip">VIP Group</option><option value="leads">Leads Group</option><option value="customers">Customers Group</option></select></div>
        <div class="form-group"><label>Message</label><textarea class="form-textarea" id="msgContent" placeholder="Type your message here..."></textarea></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" id="sendCampaignBtn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-6-4 12-3-4-5-2z" fill="currentColor"/></svg>
            Send Campaign
          </button>
          <button class="btn btn-secondary">Schedule</button>
        </div>
      </div>
    </div>
    <div>
      <div class="panel animate-in" style="margin-bottom:16px">
        <div class="panel-header"><span class="panel-title">Campaign Stats</span></div>
        <div class="panel-body">
          <div class="stats-grid" style="margin-bottom:0">
            <div class="stat-card green" style="padding:14px"><div class="stat-value" style="font-size:20px">24</div><div class="stat-label">Active</div></div>
            <div class="stat-card blue" style="padding:14px"><div class="stat-value" style="font-size:20px">156</div><div class="stat-label">Total Sent</div></div>
            <div class="stat-card purple" style="padding:14px"><div class="stat-value" style="font-size:20px">89%</div><div class="stat-label">Open Rate</div></div>
            <div class="stat-card orange" style="padding:14px"><div class="stat-value" style="font-size:20px">4.2%</div><div class="stat-label">Reply Rate</div></div>
          </div>
        </div>
      </div>
      <div class="panel animate-in">
        <div class="panel-header"><span class="panel-title">Recent Campaigns</span></div>
        <div class="panel-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Campaign</th><th>Type</th><th>Sent</th><th>Status</th></tr></thead><tbody>
            <tr><td style="font-weight:600;color:var(--text-primary)">May Promo Blast</td><td><span class="tag marketing">marketing</span></td><td>2,341</td><td><span style="color:var(--accent)">● Active</span></td></tr>
            <tr><td style="font-weight:600;color:var(--text-primary)">Order Updates</td><td><span class="tag utility">utility</span></td><td>1,892</td><td><span style="color:var(--accent)">● Active</span></td></tr>
            <tr><td style="font-weight:600;color:var(--text-primary)">Re-engagement</td><td><span class="tag campaign">campaign</span></td><td>956</td><td><span style="color:var(--text-muted)">● Completed</span></td></tr>
          </tbody></table>
        </div>
      </div>
    </div>
  </div>`;
}

function renderContacts() {
  return `
  <div class="grid-2">
    <div class="panel animate-in">
      <div class="panel-header">
        <span class="panel-title"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="var(--accent)" stroke-width="1.3"/><path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="var(--accent)" stroke-width="1.3"/></svg> Contacts (${MOCK.contacts.length})</span>
        <button class="btn btn-primary btn-sm" id="addContactBtn">+ Add Contact</button>
      </div>
      <div class="panel-body" style="padding:0;max-height:500px;overflow-y:auto" id="contactList">
        ${MOCK.contacts.map((c,i) => `<div class="contact-item"><div class="contact-avatar" style="background:${getColor(i)}">${initials(c.name)}</div><div class="contact-info"><div class="contact-name">${c.name}</div><div class="contact-phone">${c.phone}</div></div><span class="tag ${c.group === 'VIP' ? 'campaign' : c.group === 'Leads' ? 'marketing' : 'utility'}">${c.group}</span><div class="contact-actions"><button title="Message" onclick="alert('Opening chat with ${c.name}')"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3l5 3.5L12 3M2 3v8h10V3H2z" stroke="currentColor" stroke-width="1.2"/></svg></button><button title="Delete" class="del-contact"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M4 4l.5 8h5l.5-8" stroke="currentColor" stroke-width="1.2"/></svg></button></div></div>`).join('')}
      </div>
    </div>
    <div>
      <div class="panel animate-in" style="margin-bottom:16px">
        <div class="panel-header"><span class="panel-title">Quick Send</span></div>
        <div class="panel-body">
          <div class="form-group"><label>Select Contact</label><select class="form-select" id="quickContact">${MOCK.contacts.map(c => `<option>${c.name} (${c.phone})</option>`).join('')}</select></div>
          <div class="form-group"><label>Message</label><textarea class="form-textarea" id="quickMsg" placeholder="Type a message..."></textarea></div>
          <button class="btn btn-primary" id="quickSendBtn"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-6-4 12-3-4-5-2z" fill="currentColor"/></svg> Send</button>
        </div>
      </div>
      <div class="panel animate-in">
        <div class="panel-header"><span class="panel-title">Groups</span></div>
        <div class="panel-body">
          <div class="cost-item"><div class="cost-label"><span class="cost-dot" style="background:var(--accent)"></span><span>VIP</span></div><div class="cost-value">${MOCK.contacts.filter(c=>c.group==='VIP').length} contacts</div></div>
          <div class="cost-item"><div class="cost-label"><span class="cost-dot" style="background:var(--purple)"></span><span>Leads</span></div><div class="cost-value">${MOCK.contacts.filter(c=>c.group==='Leads').length} contacts</div></div>
          <div class="cost-item"><div class="cost-label"><span class="cost-dot" style="background:var(--blue)"></span><span>Customers</span></div><div class="cost-value">${MOCK.contacts.filter(c=>c.group==='Customers').length} contacts</div></div>
        </div>
      </div>
    </div>
  </div>`;
}
