'use client';
import Header from '@/components/Header';
import DonutChart from '@/components/DonutChart';

const costs = [
  { label:'Marketing', count:4230, rate:0.0858, total:362.93, color:'var(--purple)' },
  { label:'Utility', count:6120, rate:0.0358, total:219.10, color:'var(--blue)' },
  { label:'Campaign', count:1840, rate:0.0736, total:135.42, color:'var(--green)' },
  { label:'Authentication', count:657, rate:0.0465, total:30.55, color:'var(--cyan)' },
];
const grandTotal = 847.52;
const history = [
  { month:'Apr 2026', amount:792.30, status:'Paid' },
  { month:'Mar 2026', amount:865.10, status:'Paid' },
  { month:'Feb 2026', amount:710.45, status:'Paid' },
];

export default function BillingPage() {
  const totalMsgs = costs.reduce((s, c) => s + c.count, 0);
  return (
    <>
      <Header title="Billing & Costs" subtitle="Track your messaging costs and payments" />
      <div className="page-content">
        <div className="grid-2">
          <div>
            <div className="summary anim" style={{marginBottom:16}}>
              <div className="s-label">Total This Month</div>
              <div className="s-value">${grandTotal.toFixed(2)}</div>
              <div className="s-period">May 1 – May 31, 2026</div>
              <button className="btn btn-primary" style={{marginTop:16}} onClick={() => alert('Payment gateway coming soon!')}>💳 Pay Now</button>
            </div>
            <div className="glass panel anim">
              <div className="panel-head"><h3>Cost Breakdown</h3></div>
              <div className="panel-body">
                {costs.map((c, i) => (
                  <div className="cost-row" key={i}>
                    <div className="cost-label"><span className="cost-dot" style={{background:c.color}}></span><span>{c.label} <span style={{color:'var(--text3)',fontSize:11}}>({c.count.toLocaleString()} × ${c.rate})</span></span></div>
                    <div className="cost-val mono">${c.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="glass panel anim" style={{marginBottom:16}}>
              <div className="panel-head"><h3>Usage Distribution</h3></div>
              <div className="panel-body" style={{textAlign:'center'}}>
                <DonutChart segments={costs.map(c => ({value:c.total, color:c.color}))} centerValue={totalMsgs.toLocaleString()} centerLabel="Total Msgs" />
                <div className="legend">
                  {costs.map((c, i) => (
                    <div className="legend-item" key={i}><span className="legend-dot" style={{background:c.color}}></span><span>{c.label}</span><span className="legend-val mono">{(c.total/grandTotal*100).toFixed(1)}%</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass panel anim">
              <div className="panel-head"><h3>Billing History</h3></div>
              <div className="panel-body" style={{padding:0}}>
                <table className="tbl"><thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead><tbody>
                  {history.map((h, i) => (
                    <tr key={i}><td style={{fontWeight:600,color:'var(--text)'}}>{h.month}</td><td className="mono">${h.amount.toFixed(2)}</td><td><span className="tag tag-campaign">{h.status}</span></td></tr>
                  ))}
                </tbody></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
