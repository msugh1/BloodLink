import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  BrainCircuit, ArrowLeft, Download, Share2, RefreshCw,
  TrendingDown, AlertTriangle, CheckCircle, Info, ChevronRight,
  Calendar, Filter, Zap, Flame,
} from 'lucide-react';

const T = {
  primary: '#D32F2F', primaryLight: '#FFEBEE',
  secondary: '#009688', secondaryLight: '#E0F2F1',
  green: '#4CAF50', orange: '#FF9800', yellow: '#FFC107',
  text: '#111827', sub: '#6B7280', border: '#E5E7EB', bg: '#F8FAFC',
};
const CARD: React.CSSProperties = {
  backgroundColor: '#fff', border: `1px solid ${T.border}`,
  borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};
const TTP = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', fontSize: '12px', color: T.text };

/* ── Mock forecast data per resource ─────────────────────── */
const RESOURCES = ['O- Blood', 'AB+ Blood', 'B- Blood', 'A+ Blood', 'Platelet Concentrate', 'O+ Blood'];
const RESOURCE_COLORS: Record<string, string> = {
  'O- Blood': '#D32F2F', 'AB+ Blood': '#7B1FA2',
  'B- Blood': '#E65100', 'A+ Blood': '#009688',
  'Platelet Concentrate': '#FF9800', 'O+ Blood': '#1565C0',
};
const CRITICAL_THRESHOLDS: Record<string, number> = {
  'O- Blood': 5, 'AB+ Blood': 4, 'B- Blood': 4,
  'A+ Blood': 8, 'Platelet Concentrate': 3, 'O+ Blood': 10,
};

function generateForecast(resource: string) {
  const seeds: Record<string, number[]> = {
    'O- Blood': [12, 10, 8, 7, 5, 4, 3, 2, 2, 1, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 12],
    'AB+ Blood': [18, 16, 15, 14, 13, 11, 10, 10, 9, 8, 7, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 14, 15, 15, 16, 16, 17],
    'B- Blood': [14, 13, 12, 10, 9, 8, 7, 6, 6, 5, 5, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 15],
    'A+ Blood': [30, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 18, 19, 20, 21, 22, 22, 23, 24, 24, 25, 26, 26, 27, 27, 28, 28, 29, 30],
    'Platelet Concentrate': [8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 3, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10, 10, 11, 11],
    'O+ Blood': [42, 40, 38, 36, 35, 34, 32, 31, 30, 29, 28, 28, 28, 29, 30, 31, 32, 33, 33, 34, 35, 36, 36, 37, 37, 38, 39, 39, 40, 41],
  };
  const base = seeds[resource] ?? Array.from({ length: 30 }, (_, i) => Math.max(2, 20 - i * 0.5));
  const days = ['Feb 21', 'Feb 22', 'Feb 23', 'Feb 24', 'Feb 25', 'Feb 26', 'Feb 27', 'Feb 28',
    'Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8',
    'Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14', 'Mar 15', 'Mar 16',
    'Mar 17', 'Mar 18', 'Mar 19', 'Mar 20', 'Mar 21', 'Mar 22'];
  return days.map((day, i) => ({
    day,
    forecast: base[i],
    upper: Math.min(base[i] + Math.round(base[i] * 0.15 + 1), base[i] + 4),
    lower: Math.max(base[i] - Math.round(base[i] * 0.12 + 1), 0),
  }));
}

/* ── Confidence Ring ─────────────────────────────────────── */
function ConfRing({ value, color }: { value: number; color: string }) {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#F3F4F6" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      <text x="28" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{value}%</text>
    </svg>
  );
}

/* ── Insight Cards ───────────────────────────────────────── */
const ALL_INSIGHTS = [
  { resource: 'O- Blood', horizon: 3, confidence: 91, level: 'critical', recommendation: 'Transfer 4 bags from Gbagada General immediately. Contact blood bank coordinator.' },
  { resource: 'AB+ Blood', horizon: 7, confidence: 82, level: 'warning', recommendation: 'Request 2 units from LUTH. Schedule donor session for next week.' },
  { resource: 'B- Blood', horizon: 5, confidence: 76, level: 'warning', recommendation: 'Initiate inter-hospital transfer from National Orthopaedic Hospital.' },
  { resource: 'Platelet Concentrate', horizon: 10, confidence: 68, level: 'low', recommendation: 'Monitor usage rate. Coordinate with Lagos Island General for backup supply.' },
];

export function ForecastPage() {
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = useState('O- Blood');
  const [horizon, setHorizon] = useState<7 | 14 | 30>(30);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const data = generateForecast(selectedResource).slice(0, horizon);
  const color = RESOURCE_COLORS[selectedResource] ?? T.primary;
  const threshold = CRITICAL_THRESHOLDS[selectedResource] ?? 5;
  const minForecast = Math.min(...data.map(d => d.forecast));
  const daysToShortage = data.findIndex(d => d.forecast <= threshold);
  const insight = ALL_INSIGHTS.find(i => i.resource === selectedResource);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const doRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast('Forecast updated successfully!'); }, 1600);
  };

  const doExport = () => showToast('Forecast exported as PDF');
  const doShare = () => showToast('Shareable link copied to clipboard!');

  return (
    <div style={{ padding: '20px 24px 40px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          backgroundColor: '#111827', color: '#fff', padding: '12px 20px',
          borderRadius: '10px', fontSize: '13px', fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          animation: 'fadeSlide 0.3s ease',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <CheckCircle size={14} color="#4CAF50" /> {toastMsg}
        </div>
      )}


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '36px', height: '36px', borderRadius: '10px', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} color={T.sub} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BrainCircuit size={16} color="#FF6B6B" />
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: T.text, margin: 0, letterSpacing: '-0.3px' }}>Predictive Shortage Forecast</h1>
            </div>
            <p style={{ fontSize: '12px', color: T.sub, margin: '3px 0 0 40px' }}>AI-powered 30-day resource level predictions · Updated 20 Feb 2026, 08:00</p>
          </div>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={doRefresh} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.sub, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
          <button onClick={doExport} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.sub, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <Download size={14} /> Export PDF
          </button>
          <button onClick={doShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: T.primary, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 2px 8px ${T.primary}40` }}>
            <Share2 size={14} /> Share Forecast
          </button>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {ALL_INSIGHTS.map(ins => {
          const c = ins.level === 'critical' ? T.primary : ins.level === 'warning' ? T.orange : T.secondary;
          const isActive = ins.resource === selectedResource;
          return (
            <div
              key={ins.resource}
              onClick={() => setSelectedResource(ins.resource)}
              style={{
                ...CARD, padding: '16px', cursor: 'pointer',
                border: isActive ? `2px solid ${c}` : `1px solid ${T.border}`,
                backgroundColor: isActive ? `${c}08` : '#fff',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.text, marginBottom: '3px' }}>{ins.resource}</div>
                  <span style={{
                    padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                    backgroundColor: `${c}18`, color: c,
                  }}>
                    {ins.level === 'critical' ? '🚨 Critical' : ins.level === 'warning' ? '⚠️ Warning' : '🔵 Monitor'}
                  </span>
                </div>
                <ConfRing value={ins.confidence} color={c} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                <Flame size={11} color={c} />
                <span style={{ fontSize: '11px', color: T.sub }}>Shortage in <strong style={{ color: c }}>{ins.horizon} days</strong></span>
              </div>
              <div style={{ fontSize: '11px', color: T.sub, lineHeight: 1.5 }}>💡 {ins.recommendation.split('.')[0]}.</div>
            </div>
          );
        })}
      </div>


      <div style={{ ...CARD, padding: '20px', marginBottom: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: T.text, marginBottom: '4px' }}>{selectedResource} — Forecasted Stock Level</div>
            <div style={{ fontSize: '12px', color: T.sub, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={12} color={T.sub} />
              Shaded area shows upper/lower confidence bands
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>

            <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '8px', backgroundColor: '#F3F4F6' }}>
              {RESOURCES.map(r => (
                <button key={r} onClick={() => setSelectedResource(r)} style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: selectedResource === r ? 700 : 400,
                  backgroundColor: selectedResource === r ? '#fff' : 'transparent',
                  color: selectedResource === r ? RESOURCE_COLORS[r] ?? T.primary : T.sub,
                  border: 'none', cursor: 'pointer',
                  boxShadow: selectedResource === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>
                  {r.replace(' Blood', '').replace(' Concentrate', '')}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '8px', backgroundColor: '#F3F4F6' }}>
              {([7, 14, 30] as (7 | 14 | 30)[]).map(h => (
                <button key={h} onClick={() => setHorizon(h)} style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: horizon === h ? 700 : 400,
                  backgroundColor: horizon === h ? '#fff' : 'transparent',
                  color: horizon === h ? T.primary : T.sub,
                  border: 'none', cursor: 'pointer',
                  boxShadow: horizon === h ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  {h}d
                </button>
              ))}
            </div>
          </div>
        </div>


        {daysToShortage !== -1 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
            backgroundColor: daysToShortage <= 3 ? '#FFEBEE' : '#FFF3E0',
            border: `1px solid ${daysToShortage <= 3 ? '#FFCDD2' : '#FFE0B2'}`,
          }}>
            <AlertTriangle size={14} color={daysToShortage <= 3 ? T.primary : T.orange} />
            <span style={{ fontSize: '12px', color: daysToShortage <= 3 ? T.primary : '#E65100', fontWeight: 600 }}>
              {selectedResource} forecast to hit critical threshold ({threshold} units) in approximately <strong>{daysToShortage + 1} day{daysToShortage !== 0 ? 's' : ''}</strong>.
              {daysToShortage <= 3 ? ' Immediate action required.' : ' Plan restocking now.'}
            </span>
          </div>
        )}


        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id={`grad-${selectedResource}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false}
              interval={horizon === 7 ? 0 : horizon === 14 ? 1 : 4} />
            <YAxis tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TTP}
              formatter={(v: number, name: string) => [`${v} units`, name === 'upper' ? 'Upper bound' : name === 'lower' ? 'Lower bound' : 'Forecast']} />
            <ReferenceLine y={threshold} stroke={T.primary} strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: 'Critical threshold', position: 'insideTopRight', fontSize: 10, fill: T.primary }} />
            <Area type="monotone" dataKey="upper" stroke="none" fill={`url(#grad-${selectedResource})`} legendType="none" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" legendType="none" />
            <Line type="monotone" dataKey="forecast" name="Predicted level" stroke={color} strokeWidth={2.5}
              dot={false} activeDot={{ r: 5, fill: color }} />
          </AreaChart>
        </ResponsiveContainer>


        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Minimum Forecast', value: `${minForecast} units`, color: minForecast <= threshold ? T.primary : T.orange },
            { label: 'Days to Shortage', value: daysToShortage === -1 ? 'No shortage predicted' : `${daysToShortage + 1} days`, color: daysToShortage <= 3 ? T.primary : T.orange },
            { label: 'Confidence Level', value: `${insight?.confidence ?? 75}%`, color: T.secondary },
            { label: 'Critical Threshold', value: `${threshold} units`, color: T.sub },
          ].map(({ label, value, color: c }) => (
            <div key={label} style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: `1px solid ${T.border}`, flex: '1 1 140px' }}>
              <div style={{ fontSize: '11px', color: T.sub, marginBottom: '3px' }}>{label}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: c }}>{value}</div>
            </div>
          ))}
        </div>
      </div>


      {insight && (
        <div style={{ ...CARD, padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#FF6B6B" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: T.text }}>AI Recommendation — {insight.resource}</span>
          </div>
          <div style={{
            padding: '16px', borderRadius: '10px',
            backgroundColor: insight.level === 'critical' ? '#FFEBEE' : '#FFF3E0',
            border: `1px solid ${insight.level === 'critical' ? '#FFCDD2' : '#FFE0B2'}`,
            marginBottom: '14px',
          }}>
            <div style={{ fontSize: '13px', color: T.text, lineHeight: 1.65 }}>
              <strong>🎯 Primary Action:</strong> {insight.recommendation}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { step: '1', action: 'Initiate emergency transfer request', icon: '🚨' },
              { step: '2', action: 'Contact blood bank coordinator', icon: '📞' },
              { step: '3', action: 'Schedule donor drive within 48 hours', icon: '🩸' },
              { step: '4', action: 'Update stock monitoring alerts', icon: '🔔' },
            ].map(({ step, action, icon }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: `1px solid ${T.border}` }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>{step}</span>
                </div>
                <span style={{ fontSize: '12px', color: T.text, lineHeight: 1.5 }}>{icon} {action}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', backgroundColor: T.primary, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, boxShadow: `0 2px 8px ${T.primary}40` }}
              onClick={() => navigate('/sharing')}>
              Initiate Transfer Request <ChevronRight size={14} />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', backgroundColor: '#fff', color: T.secondary, border: `1.5px solid ${T.secondary}`, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              onClick={() => navigate('/alerts')}>
              Set Shortage Alert
            </button>
          </div>
        </div>
      )}


      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>All Resource Forecasts — Summary</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                {['Resource', 'Current Stock', 'Min Forecast', 'Days to Shortage', 'Confidence', 'Risk Level', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: T.sub, fontWeight: 600, borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESOURCES.map((res, i) => {
                const d = generateForecast(res);
                const thr = CRITICAL_THRESHOLDS[res] ?? 5;
                const mins = Math.min(...d.map(x => x.forecast));
                const dts = d.findIndex(x => x.forecast <= thr);
                const ins = ALL_INSIGHTS.find(x => x.resource === res);
                const level = ins?.level ?? (mins <= thr ? 'critical' : 'low');
                const lc = level === 'critical' ? T.primary : level === 'warning' ? T.orange : T.green;
                return (
                  <tr key={res}
                    style={{ borderBottom: i < RESOURCES.length - 1 ? `1px solid ${T.border}` : 'none', cursor: 'pointer' }}
                    onClick={() => setSelectedResource(res)}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: RESOURCE_COLORS[res] ?? T.primary, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{res}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: '13px', color: T.text }}>{d[0].forecast} units</td>
                    <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 600, color: mins <= thr ? T.primary : T.text }}>{mins} units</td>
                    <td style={{ padding: '11px 16px', fontSize: '13px', color: dts === -1 ? T.green : dts <= 3 ? T.primary : T.orange, fontWeight: 600 }}>
                      {dts === -1 ? '> 30 days' : `${dts + 1} day${dts !== 0 ? 's' : ''}`}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '5px', borderRadius: '3px', backgroundColor: '#F3F4F6', maxWidth: '60px' }}>
                          <div style={{ height: '100%', width: `${ins?.confidence ?? 65}%`, borderRadius: '3px', backgroundColor: lc }} />
                        </div>
                        <span style={{ fontSize: '11px', color: T.sub }}>{ins?.confidence ?? 65}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, backgroundColor: `${lc}18`, color: lc }}>
                        {level === 'critical' ? 'Critical' : level === 'warning' ? 'Warning' : 'Stable'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedResource(res); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{ padding: '4px 12px', borderRadius: '6px', border: `1px solid ${T.border}`, backgroundColor: '#fff', color: T.primary, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
