import React, { useState } from 'react';
import { AlertCircle, Clock, TrendingDown, Info, BellOff, CheckCircle, X, Settings } from 'lucide-react';
import { alertsData, getAlertTypeColors, AlertType, AlertItem } from '../data/mockData';

const T = { primary: '#D32F2F', secondary: '#009688', orange: '#FF9800', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

function AlertIcon({ type }: { type: AlertType }) {
  const sc = getAlertTypeColors(type);
  if (type === 'critical') return <AlertCircle size={18} color={sc.icon} />;
  if (type === 'expired') return <BellOff size={18} color={sc.icon} />;
  if (type === 'expiring_soon') return <Clock size={18} color={sc.icon} />;
  if (type === 'low_stock') return <TrendingDown size={18} color={sc.icon} />;
  return <Info size={18} color={sc.icon} />;
}

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Critical', value: 'critical' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Expiring', value: 'expiring_soon' },
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(alertsData);
  const [filter, setFilter] = useState('all');
  const [showThresh, setShowThresh] = useState(false);
  const [thresholds, setThresholds] = useState({ 'A+': 5, 'A-': 3, 'B+': 5, 'B-': 3, 'O+': 8, 'O-': 5, 'AB+': 3, 'AB-': 2 });

  const unread = alerts.filter(a => !a.read).length;
  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const markRead = (id: string) => setAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));
  const dismiss = (id: string) => setAlerts(p => p.filter(a => a.id !== id));
  const markAllRead = () => setAlerts(p => p.map(a => ({ ...a, read: true })));

  return (
    <div style={{ padding: '20px 24px 32px', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: T.text, margin: 0 }}>Alerts</h1>
          {unread > 0 && (
            <span style={{ padding: '2px 10px', borderRadius: '20px', backgroundColor: T.primary, color: '#fff', fontSize: '11px', fontWeight: 700 }}>
              {unread} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ fontSize: '12px', color: T.secondary, fontWeight: 500, background: 'none', border: `1px solid ${T.secondary}`, borderRadius: '8px', padding: '6px 14px', cursor: 'pointer' }}>
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowThresh(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', backgroundColor: T.secondary, color: '#fff', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Settings size={13} /> Set Thresholds
          </button>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Critical', count: alerts.filter(a => a.type === 'critical').length, color: T.primary, bg: '#FFEBEE' },
          { label: 'Low Stock', count: alerts.filter(a => a.type === 'low_stock').length, color: T.orange, bg: '#FFF3E0' },
          { label: 'Expiring', count: alerts.filter(a => a.type === 'expiring_soon').length, color: '#FFC107', bg: '#FFF8E1' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{ ...CARD, padding: '16px', textAlign: 'center', backgroundColor: bg }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: '12px', color: T.sub, marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>


      <div style={{ display: 'flex', gap: '5px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '2px' }}>
        {FILTERS.map(({ label, value }) => {
          const count = value === 'all' ? alerts.length : value === 'unread' ? alerts.filter(a => !a.read).length : alerts.filter(a => a.type === value).length;
          const active = filter === value;
          return (
            <button key={value} onClick={() => setFilter(value)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: active ? 700 : 400, cursor: 'pointer', backgroundColor: active ? T.primary : '#fff', color: active ? '#fff' : T.sub, border: `1px solid ${active ? T.primary : T.border}`, transition: 'all 0.15s' }}
            >
              {label}
              {count > 0 && (
                <span style={{ padding: '0 5px', borderRadius: '10px', backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#F3F4F6', fontSize: '10px', fontWeight: 700 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>


      {filtered.length === 0 ? (
        <div style={{ ...CARD, padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={26} color="#4CAF50" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: T.text, margin: 0 }}>All clear!</p>
          <p style={{ fontSize: '13px', color: T.sub, margin: 0 }}>No alerts in this category</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(alert => {
            const sc = getAlertTypeColors(alert.type);
            const ts = new Date(alert.timestamp);
            const timeStr = ts.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true });
            const dateStr = ts.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
            return (
              <div key={alert.id} style={{ ...CARD, padding: '16px 18px', opacity: alert.read ? 0.7 : 1, backgroundColor: alert.read ? '#fff' : sc.bg, borderColor: alert.read ? T.border : sc.border }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>

                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: alert.read ? '#F3F4F6' : sc.bg + 'cc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertIcon type={alert.type} />
                  </div>


                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: alert.read ? 500 : 700, color: T.text }}>{alert.title}</span>
                        {!alert.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: sc.icon, flexShrink: 0 }} />}
                      </div>
                      {alert.bloodType && (
                        <span style={{ padding: '2px 8px', borderRadius: '10px', backgroundColor: sc.icon + '20', color: sc.icon, fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                          {alert.bloodType}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: T.sub, margin: '0 0 8px', lineHeight: 1.55 }}>{alert.message}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#D1D5DB' }}>{dateStr} · {timeStr}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {!alert.read && (
                          <button onClick={() => markRead(alert.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: T.secondary, fontWeight: 500, background: 'none', border: `1px solid ${T.secondary}30`, cursor: 'pointer' }}
                          >
                            <CheckCircle size={11} /> Mark read
                          </button>
                        )}
                        <button onClick={() => dismiss(alert.id)}
                          style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={12} color={T.sub} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {showThresh && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={e => e.target === e.currentTarget && setShowThresh(false)}>
          <div style={{ width: '100%', maxWidth: '380px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: T.text }}>Low-Stock Thresholds</span>
              <button onClick={() => setShowThresh(false)} style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} color={T.sub} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '12px', color: T.sub, marginBottom: '16px', margin: '0 0 16px' }}>
                Set minimum bag count per blood type. You'll be alerted when stock falls below these levels.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(thresholds).map(([type, val]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '36px', borderRadius: '8px', backgroundColor: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: T.primary }}>{type}</span>
                    </div>
                    <span style={{ flex: 1, fontSize: '12px', color: T.sub }}>Min. bags</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => setThresholds(p => ({ ...p, [type]: Math.max(1, val - 1) }))} style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ width: '20px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: T.text }}>{val}</span>
                      <button onClick={() => setThresholds(p => ({ ...p, [type]: val + 1 }))} style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowThresh(false)}
                style={{ width: '100%', marginTop: '20px', padding: '11px', borderRadius: '8px', backgroundColor: T.secondary, color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                Save Thresholds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
