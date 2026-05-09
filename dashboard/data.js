// === MOCK DATA ===
const MOCK = {
  stats: { sent: 12847, received: 9432, delivered: 12341, read: 8756, failed: 506, contacts: 2341 },
  daysToPayment: 8,
  monthlyTotal: 847.52,
  chartData: [320,480,390,520,610,445,380,590,670,510,430,560,620,490,710,580,640,520,470,690,750,610,540,680,720,590,810,650,700],
  costs: {
    marketing: { count: 4230, rate: 0.0858, total: 362.93 },
    utility: { count: 6120, rate: 0.0358, total: 219.10 },
    campaign: { count: 1840, rate: 0.0736, total: 135.42 },
    auth: { count: 657, rate: 0.0465, total: 30.55 }
  },
  feedback: [
    { name: 'Arjun Mehta', rating: 5, text: 'Quick response, great support!' },
    { name: 'Priya Sharma', rating: 4, text: 'Very helpful bot, saved me time.' },
    { name: 'Rahul Patel', rating: 5, text: 'Loved the automated replies!' },
    { name: 'Ananya Roy', rating: 3, text: 'Decent, but could be faster.' }
  ],
  contacts: [
    { name: 'Arjun Mehta', phone: '+91 98765 43210', group: 'VIP' },
    { name: 'Priya Sharma', phone: '+91 87654 32109', group: 'Leads' },
    { name: 'Rahul Patel', phone: '+91 76543 21098', group: 'Customers' },
    { name: 'Ananya Roy', phone: '+91 65432 10987', group: 'VIP' },
    { name: 'Vikram Singh', phone: '+91 54321 09876', group: 'Leads' },
    { name: 'Neha Gupta', phone: '+91 43210 98765', group: 'Customers' },
    { name: 'Karan Joshi', phone: '+91 32109 87654', group: 'Leads' },
    { name: 'Deepa Nair', phone: '+91 21098 76543', group: 'VIP' }
  ],
  recentMessages: [
    { to: 'Arjun Mehta', type: 'campaign', status: 'delivered', time: '2 min ago' },
    { to: 'Priya Sharma', type: 'utility', status: 'read', time: '5 min ago' },
    { to: 'Rahul Patel', type: 'marketing', status: 'sent', time: '12 min ago' },
    { to: 'Ananya Roy', type: 'auth', status: 'delivered', time: '18 min ago' },
    { to: 'Vikram Singh', type: 'campaign', status: 'failed', time: '25 min ago' }
  ],
  billingHistory: [
    { month: 'Apr 2026', amount: 792.30, status: 'Paid', date: 'Apr 1' },
    { month: 'Mar 2026', amount: 865.10, status: 'Paid', date: 'Mar 1' },
    { month: 'Feb 2026', amount: 710.45, status: 'Paid', date: 'Feb 1' }
  ]
};

const COLORS = ['#25D366','#3b82f6','#a855f7','#f59e0b','#06b6d4','#ef4444','#ec4899','#10b981'];
function getColor(i) { return COLORS[i % COLORS.length]; }
function initials(n) { return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }
function stars(r) { let s=''; for(let i=1;i<=5;i++) s+=`<span class="star${i>r?' empty':''}">★</span>`; return s; }
