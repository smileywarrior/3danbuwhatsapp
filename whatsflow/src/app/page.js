import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/AreaChart';
import BarChart from '@/components/BarChart';

const trafficData = [320,480,390,520,610,445,380,590,670,510,430,560,620,490,710,580,640,520,470,690,750,610,540,680,720,590,810,650,700,760];
const weeklyData = [420,380,510,460,590,480,620];
const weekLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const weekColors = ['#25D366','#25D366','#25D366','#25D366','#3b82f6','#a855f7','#a855f7'];

const feedback = [
  { name:'Arjun Mehta', rating:5, text:'Quick response, great support!' },
  { name:'Priya Sharma', rating:4, text:'Very helpful bot, saved me a lot of time.' },
  { name:'Rahul Patel', rating:5, text:'Loved the automated replies!' },
  { name:'Ananya Roy', rating:3, text:'Decent overall, could be faster.' },
];

const recent = [
  { to:'Arjun Mehta', type:'campaign', status:'delivered', time:'2 min ago' },
  { to:'Priya Sharma', type:'utility', status:'read', time:'5 min ago' },
  { to:'Rahul Patel', type:'marketing', status:'sent', time:'12 min ago' },
  { to:'Ananya Roy', type:'auth', status:'delivered', time:'18 min ago' },
  { to:'Vikram Singh', type:'campaign', status:'failed', time:'25 min ago' },
];

function Stars({ n }) {
  return <span className="stars">{Array.from({length:5},(_,i) => <span key={i} className={i < n ? '' : 'star-empty'}>★</span>)}</span>;
}

function StatusDot({ status }) {
  const colors = { delivered:'var(--blue)', read:'var(--green)', sent:'var(--text3)', failed:'var(--red)' };
  return <span style={{ color: colors[status] }}>● {status.charAt(0).toUpperCase()+status.slice(1)}</span>;
}

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Welcome back! Here's your WhatsApp overview" />
      <div className="page-content">
        {/* Payment Banner */}
        <div className="banner anim">
          <div className="b-icon icon-orange">⏰</div>
          <div className="b-text">
            <h3>Payment Due in 8 Days</h3>
            <p>Your next billing cycle ends May 15, 2026 · Current usage: $847.52</p>
          </div>
          <a href="/billing"><button className="b-action">Pay Now →</button></a>
        </div>

        {/* Stat Cards */}
        <div className="stats-row">
          <StatCard icon="📨" value="12,847" label="Messages Sent" change="12.5%" changeDir="up" colorClass="icon-green" />
          <StatCard icon="📩" value="9,432" label="Messages Received" change="8.3%" changeDir="up" colorClass="icon-blue" />
          <StatCard icon="✓" value="12,341" label="Delivered" change="96.1%" changeDir="up" colorClass="icon-purple" />
          <StatCard icon="👥" value="2,341" label="Total Contacts" change="5.2%" changeDir="up" colorClass="icon-orange" />
        </div>

        {/* Charts Row */}
        <div className="grid-3">
          <div className="glass panel anim">
            <div className="panel-head"><h3>📈 Message Traffic — 30 Days</h3><span className="mono" style={{color:'var(--text3)',fontSize:12}}>8.25K avg</span></div>
            <div className="panel-body"><AreaChart data={trafficData} /></div>
          </div>
          <div className="glass panel anim">
            <div className="panel-head"><h3>📊 Weekly Breakdown</h3></div>
            <div className="panel-body"><BarChart data={weeklyData} colors={weekColors} labels={weekLabels} height={200} /></div>
          </div>
        </div>

        {/* Feedback & Recent */}
        <div className="grid-2">
          <div className="glass panel anim">
            <div className="panel-head"><h3>⭐ Customer Feedback</h3></div>
            <div className="panel-body">
              {feedback.map((f, i) => (
                <div className="fb-item" key={i}>
                  <div className="fb-head"><span className="fb-name">{f.name}</span><Stars n={f.rating}/></div>
                  <p className="fb-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass panel anim">
            <div className="panel-head"><h3>📋 Recent Messages</h3></div>
            <div className="panel-body" style={{padding:0}}>
              <table className="tbl"><thead><tr><th>Recipient</th><th>Type</th><th>Status</th><th>Time</th></tr></thead><tbody>
                {recent.map((m, i) => (
                  <tr key={i}>
                    <td style={{color:'var(--text)',fontWeight:600}}>{m.to}</td>
                    <td><span className={`tag tag-${m.type}`}>{m.type}</span></td>
                    <td><StatusDot status={m.status}/></td>
                    <td>{m.time}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
