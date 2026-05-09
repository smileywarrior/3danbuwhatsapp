'use client';
import { useState } from 'react';
import Header from '@/components/Header';

const COLORS = ['#25D366','#3b82f6','#a855f7','#f97316','#06b6d4','#ef4444','#ec4899','#10b981'];
const initContacts = [
  { name:'Arjun Mehta', phone:'+91 98765 43210', group:'VIP' },
  { name:'Priya Sharma', phone:'+91 87654 32109', group:'Leads' },
  { name:'Rahul Patel', phone:'+91 76543 21098', group:'Customers' },
  { name:'Ananya Roy', phone:'+91 65432 10987', group:'VIP' },
  { name:'Vikram Singh', phone:'+91 54321 09876', group:'Leads' },
  { name:'Neha Gupta', phone:'+91 43210 98765', group:'Customers' },
  { name:'Karan Joshi', phone:'+91 32109 87654', group:'Leads' },
  { name:'Deepa Nair', phone:'+91 21098 76543', group:'VIP' },
];

function initials(n) { return n.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(); }
function tagClass(g) { return g === 'VIP' ? 'tag-campaign' : g === 'Leads' ? 'tag-marketing' : 'tag-utility'; }

export default function ContactsPage() {
  const [contacts, setContacts] = useState(initContacts);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', group:'VIP' });
  const [quickMsg, setQuickMsg] = useState('');

  const addContact = () => {
    if (!form.name || !form.phone) { alert('Fill all fields'); return; }
    setContacts([{ ...form }, ...contacts]);
    setForm({ name:'', phone:'', group:'VIP' });
    setShowModal(false);
  };

  const groups = { VIP: contacts.filter(c => c.group === 'VIP').length, Leads: contacts.filter(c => c.group === 'Leads').length, Customers: contacts.filter(c => c.group === 'Customers').length };

  return (
    <>
      <Header title="Contacts" subtitle="Manage your WhatsApp contacts" />
      <div className="page-content">
        <div className="grid-2">
          <div className="glass panel anim">
            <div className="panel-head">
              <h3>👤 Contacts ({contacts.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Contact</button>
            </div>
            <div className="panel-body" style={{padding:0,maxHeight:480,overflowY:'auto'}}>
              {contacts.map((c, i) => (
                <div className="contact-row" key={i}>
                  <div className="avatar" style={{background:COLORS[i % COLORS.length]}}>{initials(c.name)}</div>
                  <div className="contact-info"><div className="contact-name">{c.name}</div><div className="contact-phone">{c.phone}</div></div>
                  <span className={`tag ${tagClass(c.group)}`}>{c.group}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="glass panel anim" style={{marginBottom:16}}>
              <div className="panel-head"><h3>💬 Quick Send</h3></div>
              <div className="panel-body">
                <div className="form-group"><label>Select Contact</label><select className="form-select">{contacts.map((c,i) => <option key={i}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Message</label><textarea className="form-textarea" placeholder="Type a message..." value={quickMsg} onChange={e => setQuickMsg(e.target.value)}/></div>
                <button className="btn btn-primary" onClick={() => {if(!quickMsg.trim()){alert('Enter a message');return}alert('Sent!');setQuickMsg('')}}>🚀 Send</button>
              </div>
            </div>
            <div className="glass panel anim">
              <div className="panel-head"><h3>📁 Groups</h3></div>
              <div className="panel-body">
                {Object.entries(groups).map(([g, c], i) => (
                  <div className="cost-row" key={i}><div className="cost-label"><span className="cost-dot" style={{background:COLORS[i]}}></span><span>{g}</span></div><div className="cost-val mono">{c} contacts</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}} onClick={() => setShowModal(false)}>
          <div className="glass" style={{width:'90%',maxWidth:440,padding:0}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px',borderBottom:'1px solid var(--border)'}}>
              <h2 style={{fontSize:16,fontWeight:700}}>Add New Contact</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{padding:22}}>
              <div className="form-group"><label>Full Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. John Doe"/></div>
              <div className="form-group"><label>Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="+91 98765 43210"/></div>
              <div className="form-group"><label>Group</label><select className="form-select" value={form.group} onChange={e => setForm({...form, group:e.target.value})}><option>VIP</option><option>Leads</option><option>Customers</option></select></div>
            </div>
            <div style={{padding:'16px 22px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'flex-end',gap:8}}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addContact}>Add Contact</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
