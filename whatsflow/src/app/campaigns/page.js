'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/BarChart';

const campaigns = [
  { name:'May Promo Blast', type:'marketing', sent:2341, status:'Active' },
  { name:'Order Updates', type:'utility', sent:1892, status:'Active' },
  { name:'Re-engagement', type:'campaign', sent:956, status:'Completed' },
];
const perf = [85,92,78,88,95,82,90];
const perfLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function CampaignsPage() {
  const [msg, setMsg] = useState('');
  return (
    <>
      <Header title="Campaigns" subtitle="Create and manage message campaigns" />
      <div className="page-content">
        <div className="grid-2">
          <div className="glass panel anim">
            <div className="panel-head"><h3>✉️ Send Campaign Message</h3></div>
            <div className="panel-body">
              <div className="form-group"><label>Message Type</label><select className="form-select"><option>Campaign</option><option>Marketing</option><option>Utility</option></select></div>
              <div className="form-group"><label>Recipients</label><select className="form-select"><option>All Contacts (8)</option><option>VIP Group</option><option>Leads Group</option><option>Customers Group</option></select></div>
              <div className="form-group"><label>Message</label><textarea className="form-textarea" placeholder="Type your message here..." value={msg} onChange={e => setMsg(e.target.value)}/></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary" onClick={() => {if(!msg.trim()){alert('Enter a message');return}alert('Campaign sent!');setMsg('')}}>🚀 Send Campaign</button>
                <button className="btn btn-ghost">📅 Schedule</button>
              </div>
            </div>
          </div>
          <div>
            <div className="stats-row" style={{gridTemplateColumns:'1fr 1fr',marginBottom:16}}>
              <StatCard icon="🟢" value="24" label="Active" colorClass="icon-green" />
              <StatCard icon="📤" value="156" label="Total Sent" colorClass="icon-blue" />
              <StatCard icon="👁" value="89%" label="Open Rate" colorClass="icon-purple" />
              <StatCard icon="💬" value="4.2%" label="Reply Rate" colorClass="icon-orange" />
            </div>
            <div className="glass panel anim">
              <div className="panel-head"><h3>📊 Weekly Performance</h3></div>
              <div className="panel-body"><BarChart data={perf} labels={perfLabels} colors={['#25D366','#3b82f6','#a855f7','#25D366','#3b82f6','#a855f7','#25D366']} height={160}/></div>
            </div>
          </div>
        </div>
        <div className="glass panel anim">
          <div className="panel-head"><h3>📋 Recent Campaigns</h3></div>
          <div className="panel-body" style={{padding:0}}>
            <table className="tbl"><thead><tr><th>Campaign</th><th>Type</th><th>Sent</th><th>Status</th></tr></thead><tbody>
              {campaigns.map((c, i) => (
                <tr key={i}><td style={{fontWeight:600,color:'var(--text)'}}>{c.name}</td><td><span className={`tag tag-${c.type}`}>{c.type}</span></td><td className="mono">{c.sent.toLocaleString()}</td><td>{c.status === 'Active' ? <span style={{color:'var(--green)'}}>● Active</span> : <span style={{color:'var(--text3)'}}>● Completed</span>}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      </div>
    </>
  );
}
