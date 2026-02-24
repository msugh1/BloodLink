import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import {
  Download, BarChart3, TrendingUp, ArrowLeftRight,
  BrainCircuit, FileText, Zap, CheckCircle, Mail, Link2,
  Calendar, Filter, ChevronDown, Clock, AlertCircle, X,
} from 'lucide-react';
import { usageData, bloodTypeUsage, transferData, wastageData } from '../data/mockData';

const T = { primary: '#D32F2F', secondary: '#009688', orange: '#FF9800', green: '#4CAF50', yellow: '#FFC107', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };
const TTP = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', fontSize: '12px', color: T.text };

const TABS = [
  { id: 'usage', label: 'Usage', icon: BarChart3 },
  { id: 'wastage', label: 'Wastage', icon: TrendingUp },
  { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
];

function KPI({ label, value, color, bg }: { label: string; value: string | number; color: string; bg: string }) {
  return (
    <div style={{ ...CARD, padding: '16px', textAlign: 'center', backgroundColor: bg }}>
      <div style={{ fontSize: '26px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: T.sub, marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function SCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...CARD, padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: T.text, marginBottom: '16px' }}>{title}</div>
      {children}
    </div>
  );
}

function UsageTab() {
  const totalUsed = usageData.reduce((s, d) => s + d.used, 0);
  const totalReceived = usageData.reduce((s, d) => s + d.received, 0);
  const utilPct = Math.round((totalUsed / totalReceived) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <KPI label="Total Issued" value={totalUsed} color={T.primary} bg="#FFEBEE" />
        <KPI label="Total Received" value={totalReceived} color={T.secondary} bg="#E0F2F1" />
        <KPI label="Utilization" value={`${utilPct}%`} color={T.green} bg="#E8F5E9" />
      </div>
      <SCard title="Usage vs Received (Last 6 Months)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={usageData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TTP} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="used" name="Issued" stroke={T.primary} strokeWidth={2.5} dot={{ fill: T.primary, r: 4 }} />
            <Line type="monotone" dataKey="received" name="Received" stroke={T.secondary} strokeWidth={2.5} dot={{ fill: T.secondary, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </SCard>
      <SCard title="Usage by Blood Type">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bloodTypeUsage} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TTP} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="used" name="Used" fill={T.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="available" name="Available" fill={T.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SCard>
      <SCard title="Blood Type Rankings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[...bloodTypeUsage].sort((a, b) => b.used - a.used).map((item, idx) => {
            const pct = Math.round((item.used / Math.max(...bloodTypeUsage.map(x => x.used))) * 100);
            return (
              <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: idx < 3 ? T.primary + '20' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: idx < 3 ? T.primary : T.sub }}>{idx + 1}</span>
                </div>
                <div style={{ width: '36px', height: '28px', borderRadius: '8px', backgroundColor: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: T.primary }}>{item.type}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11px', color: T.text, fontWeight: 500 }}>{item.used} bags</span>
                    <span style={{ fontSize: '10px', color: T.sub }}>{pct}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', backgroundColor: T.primary }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SCard>
    </div>
  );
}

function WastageTab() {
  const totalExpired = wastageData.reduce((s, d) => s + d.expired, 0);
  const totalContaminated = wastageData.reduce((s, d) => s + d.contaminated, 0);
  const totalWasted = totalExpired + totalContaminated;
  const pieData = [
    { name: 'Expired', value: totalExpired, color: T.primary },
    { name: 'Contaminated', value: totalContaminated, color: T.orange },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <KPI label="Total Wasted" value={totalWasted} color={T.primary} bg="#FFEBEE" />
        <KPI label="Expired" value={totalExpired} color="#F44336" bg="#FFEBEE" />
        <KPI label="Contaminated" value={totalContaminated} color={T.orange} bg="#FFF3E0" />
      </div>
      <SCard title="Wastage Over Time">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={wastageData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TTP} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="expired" name="Expired" fill={T.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="contaminated" name="Contaminated" fill={T.orange} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SCard>
      <SCard title="Wastage Breakdown">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <PieChart width={130} height={130}>
            <Pie data={pieData} cx={65} cy={65} innerRadius={36} outerRadius={60} paddingAngle={3} dataKey="value">
              {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={TTP} />
          </PieChart>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pieData.map(({ name, value, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: T.text }}>{name}</div>
                  <div style={{ fontSize: '11px', color: T.sub }}>{value} bags ({Math.round(value / totalWasted * 100)}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#FFF8E1', border: `1px solid #FFC10730` }}>
          <div style={{ fontSize: '11px', color: T.sub, marginBottom: '2px' }}>Wastage Rate (Feb 2026)</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: T.yellow, lineHeight: 1 }}>4.8%</div>
          <div style={{ fontSize: '11px', color: T.sub, marginTop: '2px' }}>
            Target: &lt;5% · Status: <span style={{ color: T.green, fontWeight: 600 }}>✓ Within target</span>
          </div>
        </div>
      </SCard>
    </div>
  );
}

function TransfersTab() {
  const totalSent = transferData.reduce((s, d) => s + d.sent, 0);
  const totalReceived = transferData.reduce((s, d) => s + d.received, 0);
  const net = totalReceived - totalSent;
  const recent = [
    { type: 'Sent', bloodType: 'B-', qty: 1, hospital: 'National Ortho', date: 'Feb 19' },
    { type: 'Received', bloodType: 'A+', qty: 5, hospital: 'LUTH', date: 'Feb 20' },
    { type: 'Sent', bloodType: 'O+', qty: 2, hospital: 'Gbagada General', date: 'Feb 18' },
    { type: 'Received', bloodType: 'O-', qty: 3, hospital: 'Isolo General', date: 'Feb 17' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <KPI label="Sent Out" value={totalSent} color={T.primary} bg="#FFEBEE" />
        <KPI label="Received In" value={totalReceived} color={T.green} bg="#E8F5E9" />
        <KPI label="Net Balance" value={`+${net}`} color={T.secondary} bg="#E0F2F1" />
      </div>
      <SCard title="Transfers Over Time">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={transferData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TTP} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="sent" name="Sent Out" fill={T.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="received" name="Received" fill={T.green} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SCard>
      <SCard title="Recent Transfers">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', backgroundColor: t.type === 'Sent' ? '#FFEBEE' : '#E8F5E9' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: t.type === 'Sent' ? T.primary : T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowLeftRight size={15} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>
                  {t.type} <strong>{t.bloodType}</strong> · {t.qty} bag{t.qty !== 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: '11px', color: T.sub }}>{t.type === 'Sent' ? 'To' : 'From'}: {t.hospital}</div>
              </div>
              <span style={{ fontSize: '11px', color: T.sub }}>{t.date}</span>
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

export function ReportsPage() {
  const [tab, setTab] = useState('usage');
  return (
    <div style={{ padding: '20px 24px 32px', maxWidth: '900px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: T.text, margin: 0 }}>Reports & Compliance</h1>
          <p style={{ fontSize: '13px', color: T.sub, margin: '3px 0 0' }}>Sep 2025 – Feb 2026</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', backgroundColor: T.secondary, color: '#fff', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: `0 2px 8px ${T.secondary}40` }}>
          <Download size={14} /> Export
        </button>
      </div>


      <AISmartReports />


      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
        <span style={{ fontSize: '12px', color: T.sub, fontWeight: 600, whiteSpace: 'nowrap' }}>STANDARD REPORTS</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
      </div>


      <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '10px', backgroundColor: '#F3F4F6', marginBottom: '20px', width: 'fit-content' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', backgroundColor: tab === id ? '#fff' : 'transparent', color: tab === id ? T.primary : T.sub, fontWeight: tab === id ? 700 : 400, border: 'none', boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === 'usage' && <UsageTab />}
      {tab === 'wastage' && <WastageTab />}
      {tab === 'transfers' && <TransfersTab />}
    </div>
  );
}


const REPORT_TEMPLATES = [
  {
    id: 'stockout',
    title: 'Predicted Stock Out Report',
    description: 'AI-generated forecast of blood types and supplies predicted to run out in the next 7–30 days, based on current consumption patterns and historical trends.',
    icon: AlertCircle,
    color: '#D32F2F',
    bg: '#FFEBEE',
    badge: 'Critical',
    badgeColor: '#D32F2F',
  },
  {
    id: 'utilization',
    title: 'Resource Utilization Trends',
    description: 'Comprehensive analysis of blood usage efficiency, wastage rates, donor trends, and cross-facility distribution patterns over the selected period.',
    icon: TrendingUp,
    color: '#009688',
    bg: '#E0F2F1',
    badge: 'Insight',
    badgeColor: '#009688',
  },
  {
    id: 'emergency',
    title: 'Emergency Response Forecast',
    description: 'Predictive report on emergency blood demand surges based on seasonal patterns, event calendars, and regional incident history. Includes surge preparedness score.',
    icon: Zap,
    color: '#FF9800',
    bg: '#FFF3E0',
    badge: 'Forecast',
    badgeColor: '#FF9800',
  },
];

type GenState = 'idle' | 'generating' | 'done';
type SavedReport = { id: string; title: string; date: string; size: string };

function AISmartReports() {
  const [genState, setGenState] = useState<Record<string, GenState>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [toast, setToast] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [facility, setFacility] = useState('All Facilities');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const generate = (id: string, title: string) => {
    setGenState(s => ({ ...s, [id]: 'generating' }));
    setProgress(p => ({ ...p, [id]: 0 }));
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setGenState(s => ({ ...s, [id]: 'done' }));
        setPreview(id);
        setSaved(sv => [
          { id, title, date: 'Feb 20, 2026', size: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB` },
          ...sv.filter(x => x.id !== id),
        ]);
      }
      setProgress(pr => ({ ...pr, [id]: Math.min(p, 100) }));
    }, 180);
  };

  const handleDownload = (title: string) => showToast(`"${title}" downloaded as PDF`);
  const handleEmail = (title: string) => showToast(`"${title}" emailed to dr.adeyemi@hospital.ng`);
  const handleShare = (title: string) => showToast(`Share link for "${title}" copied to clipboard`);

  return (
    <div style={{ marginBottom: '28px' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          backgroundColor: '#111827', color: '#fff', padding: '12px 20px',
          borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', animation: 'fadeSlide 0.3s ease',
        }}>
          <CheckCircle size={14} color="#4CAF50" /> {toast}
        </div>
      )}


      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E, #16213E 60%, #0F3460)',
        borderRadius: '14px', padding: '20px 22px', marginBottom: '16px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'rgba(211,47,47,0.1)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(211,47,47,0.2)', border: '1px solid rgba(211,47,47,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={18} color="#FF6B6B" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI Smart Reports
                <span style={{ padding: '1px 7px', borderRadius: '8px', backgroundColor: 'rgba(255,107,107,0.2)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B', fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  POWERED BY AI
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Automatically generated strategic reports with forecasts and key insights</div>
            </div>
          </div>


          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                style={{ padding: '7px 28px 7px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', cursor: 'pointer', outline: 'none', appearance: 'none' }}>
                {['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'Custom'].map(r => <option key={r} style={{ color: '#111' }}>{r}</option>)}
              </select>
              <Calendar size={12} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <select value={facility} onChange={e => setFacility(e.target.value)}
                style={{ padding: '7px 28px 7px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', cursor: 'pointer', outline: 'none', appearance: 'none' }}>
                {['All Facilities', 'General Hospital Lagos', 'LUTH', 'Gbagada General', 'National Orthopaedic'].map(f => <option key={f} style={{ color: '#111' }}>{f}</option>)}
              </select>
              <Filter size={12} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: preview ? '20px' : '0' }}>
        {REPORT_TEMPLATES.map(({ id, title, description, icon: Icon, color, bg, badge, badgeColor }) => {
          const state = genState[id] ?? 'idle';
          const prog = progress[id] ?? 0;
          return (
            <div key={id} style={{ backgroundColor: '#fff', border: `1px solid #E5E7EB`, borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, backgroundColor: `${badgeColor}15`, color: badgeColor }}>
                  {badge}
                </span>
              </div>


              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6 }}>{description}</div>
              </div>


              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', backgroundColor: '#F3F4F6', color: '#6B7280' }}>📅 {dateRange}</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', backgroundColor: '#F3F4F6', color: '#6B7280' }}>🏥 {facility.length > 18 ? facility.slice(0, 18) + '…' : facility}</span>
              </div>


              {state === 'generating' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>Generating report…</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color }}>  {Math.round(prog)}%</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '3px', backgroundColor: '#F3F4F6' }}>
                    <div style={{ height: '100%', width: `${prog}%`, borderRadius: '3px', backgroundColor: color, transition: 'width 0.2s ease' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={9} /> Analysing {dateRange.toLowerCase()} data…
                  </div>
                </div>
              )}


              {state !== 'generating' && (
                <button
                  onClick={() => { if (state === 'done') { setPreview(id); } else { generate(id, title); } }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    padding: '10px', borderRadius: '9px',
                    backgroundColor: state === 'done' ? `${color}12` : color,
                    color: state === 'done' ? color : '#fff',
                    border: state === 'done' ? `1.5px solid ${color}30` : 'none',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    boxShadow: state === 'done' ? 'none' : `0 2px 8px ${color}40`,
                    transition: 'all 0.2s',
                  }}
                >
                  {state === 'done' ? (
                    <><CheckCircle size={14} /> View Generated Report</>
                  ) : (
                    <><Zap size={14} /> Generate Report</>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>


      {preview && (() => {
        const tmpl = REPORT_TEMPLATES.find(t => t.id === preview)!;
        const Icon = tmpl.icon;
        const saved_entry = saved.find(s => s.id === preview);
        return (
          <div style={{ backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', backgroundColor: '#F9FAFB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: tmpl.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={tmpl.color} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: T.text }}>{tmpl.title}</div>
                  <div style={{ fontSize: '11px', color: T.sub }}>Generated Feb 20, 2026 · {dateRange} · {facility} {saved_entry ? `· ${saved_entry.size}` : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => handleDownload(tmpl.title)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.text, fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                  <Download size={13} /> Download PDF
                </button>
                <button onClick={() => handleEmail(tmpl.title)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.text, fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                  <Mail size={13} /> Email Report
                </button>
                <button onClick={() => handleShare(tmpl.title)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: tmpl.color, color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  <Link2 size={13} /> Share Link
                </button>
                <button onClick={() => setPreview(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} color={T.sub} />
                </button>
              </div>
            </div>


            <div style={{ padding: '20px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                {preview === 'stockout' && [
                  { label: 'Resources at Risk', value: '4', color: T.primary, bg: '#FFEBEE' },
                  { label: 'Critical (≤3 days)', value: '1', color: '#F44336', bg: '#FFEBEE' },
                  { label: 'Avg. Confidence', value: '79%', color: T.secondary, bg: '#E0F2F1' },
                  { label: 'Est. Units Needed', value: '23', color: T.orange, bg: '#FFF3E0' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} style={{ padding: '14px', borderRadius: '10px', backgroundColor: bg, textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '11px', color: T.sub, marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
                {preview === 'utilization' && [
                  { label: 'Utilization Rate', value: '87%', color: T.secondary, bg: '#E0F2F1' },
                  { label: 'Wastage Rate', value: '4.8%', color: T.yellow, bg: '#FFF8E1' },
                  { label: 'Units Issued', value: '248', color: T.primary, bg: '#FFEBEE' },
                  { label: 'Top Blood Type', value: 'O+', color: T.orange, bg: '#FFF3E0' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} style={{ padding: '14px', borderRadius: '10px', backgroundColor: bg, textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '11px', color: T.sub, marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
                {preview === 'emergency' && [
                  { label: 'Surge Risk Score', value: '72%', color: T.orange, bg: '#FFF3E0' },
                  { label: 'Preparedness', value: '68%', color: T.yellow, bg: '#FFF8E1' },
                  { label: 'High-Risk Days', value: '3', color: T.primary, bg: '#FFEBEE' },
                  { label: 'Buffer Units', value: '14', color: T.secondary, bg: '#E0F2F1' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} style={{ padding: '14px', borderRadius: '10px', backgroundColor: bg, textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '11px', color: T.sub, marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
              </div>


              <div style={{ border: `1px solid ${T.border}`, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '12px' }}>
                  {preview === 'stockout' ? 'Predicted Stock Levels — Next 14 Days' : preview === 'utilization' ? 'Usage Trend — Last 6 Months' : 'Emergency Demand Forecast — Next 30 Days'}
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={usageData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TTP} />
                    <defs>
                      <linearGradient id="previewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={tmpl.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={tmpl.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="used" stroke={tmpl.color} strokeWidth={2} fill="url(#previewGrad)" dot={false} name="Issued" />
                    <Area type="monotone" dataKey="received" stroke={T.secondary} strokeWidth={1.5} fill="none" dot={false} name="Received" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>


              <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803D', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BrainCircuit size={13} color="#15803D" /> AI Key Insights
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {(preview === 'stockout' ? [
                    'O- blood is forecast to reach critical levels within 3 days — immediate action required',
                    'AB+ and B- show downward trends — request inter-hospital transfers proactively',
                    'Platelet concentrate demand expected to rise 28% next week',
                  ] : preview === 'utilization' ? [
                    'Utilization rate improved by 6% compared to previous period',
                    'O+ remains highest-demand blood type at 34% of total issues',
                    'Wastage within target range at 4.8% — maintain current protocols',
                  ] : [
                    'Moderate surge risk identified over the next 7–10 days',
                    'Recommended buffer: 8 additional O+ and 4 O- units before Mar 1',
                    'Historical data shows 22% demand spike during public holidays',
                  ]).map((insight, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#166534', lineHeight: 1.55 }}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })()}


      {saved.length > 0 && (
        <div style={{ marginTop: '16px', backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, fontSize: '13px', fontWeight: 700, color: T.text }}>
            Saved Reports
          </div>
          {saved.map((r, i) => {
            const tmpl = REPORT_TEMPLATES.find(t => t.id === r.id)!;
            const Icon = tmpl?.icon ?? FileText;
            return (
              <div key={r.id} style={{ padding: '12px 20px', borderBottom: i < saved.length - 1 ? `1px solid ${T.border}` : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: tmpl?.bg ?? '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={tmpl?.color ?? T.sub} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{r.title}</div>
                  <div style={{ fontSize: '11px', color: T.sub }}>{r.date} · {r.size}</div>
                </div>
                <button onClick={() => setPreview(r.id)} style={{ padding: '5px 12px', borderRadius: '6px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.primary, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                  Open
                </button>
                <button onClick={() => handleDownload(r.title)} style={{ padding: '5px 10px', borderRadius: '6px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.sub, fontSize: '11px', cursor: 'pointer' }}>
                  <Download size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}