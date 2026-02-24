import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp, TrendingDown, Droplets, Activity, Package, AlertCircle,
  BrainCircuit, ChevronRight, ChevronLeft, Eye, Droplet, MoreHorizontal,
  Search, Download,
} from 'lucide-react';
import {
  alertsData, getStatusColors,
  getDaysToExpiry, formatExpiryLabel, BloodStatus,
} from '../data/mockData';
import { useInventory } from '../context/InventoryContext';

/* ── Design tokens ───────────────────────────────────────── */
const T = {
  primary: '#D32F2F',
  primaryLight: '#FFEBEE',
  secondary: '#009688',
  secondaryLight: '#E0F2F1',
  green: '#4CAF50',
  greenLight: '#E8F5E9',
  orange: '#FF9800',
  orangeLight: '#FFF3E0',
  text: '#111827',
  sub: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
};

const CARD: React.CSSProperties = {
  backgroundColor: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

/* ── Segmented Semicircle Gauge ──────────────────────────── */
function SegmentGauge({ value, color = T.secondary }: { value: number; color?: string }) {
  const segs = 30, cx = 70, cy = 72, r = 48, tl = 11;
  const filled = Math.round((value / 100) * segs);
  return (
    <svg width="140" height="88" viewBox="0 0 140 88">
      {Array.from({ length: segs }, (_, i) => {
        const ang = 180 - (i * 180 / (segs - 1));
        const rad = (ang * Math.PI) / 180;
        const x1 = cx + r * Math.cos(rad), y1 = cy - r * Math.sin(rad);
        const x2 = cx + (r + tl) * Math.cos(rad), y2 = cy - (r + tl) * Math.sin(rad);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i < filled ? color : '#E5E7EB'}
            strokeWidth={i < filled ? 3.5 : 2.5}
            strokeLinecap="round" />
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="23" fontWeight="700" fill={T.text}>{value}%</text>
      <text x={cx} y={cy + 17} textAnchor="middle" fontSize="9" fill={T.sub}>Safe stock</text>
      <text x="4" y={cy + 20} textAnchor="middle" fontSize="8" fill="#D1D5DB">0</text>
      <text x={cx} y="10" textAnchor="middle" fontSize="8" fill="#D1D5DB">50</text>
      <text x="136" y={cy + 20} textAnchor="middle" fontSize="8" fill="#D1D5DB">100</text>
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
function PctBadge({ text, up }: { text: string; up: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '2px',
      padding: '2px 7px', borderRadius: '20px',
      backgroundColor: up ? T.greenLight : T.primaryLight,
      color: up ? T.green : T.primary,
      fontSize: '10px', fontWeight: 600,
    }}>
      {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
      {text}
    </span>
  );
}

function CardTop({ iconBg, icon: Icon, title, onMore }: {
  iconBg: string; icon: React.ElementType; title: string; onMore?: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={T.primary} />
        </div>
        <span style={{ fontSize: '12px', color: T.sub, fontWeight: 500 }}>{title}</span>
      </div>
      {onMore && (
        <button onClick={onMore} style={{ fontSize: '11px', color: T.primary, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
          View more <ChevronRight size={11} />
        </button>
      )}
    </div>
  );
}

/* ── Card 1: Top Blood Types ─────────────────────────────── */
function Card1({ onMore }: { onMore: () => void }) {
  const { bloodTypeSummary } = useInventory();
  const typeColors: Record<string, string> = {
    'O+': '#D32F2F', 'A+': '#009688', 'B+': '#FF9800',
    'O-': '#8B0000', 'A-': '#00695C', 'B-': '#E65100',
    'AB+': '#7B1FA2', 'AB-': '#5D4037',
  };
  const top3 = [...bloodTypeSummary].sort((a, b) => b.total - a.total).slice(0, 3);
  const maxV = top3[0]?.total ?? 1;
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <CardTop iconBg={T.primaryLight} icon={Droplets} title="Top Blood Types" onMore={onMore} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
        <span style={{ fontSize: '34px', fontWeight: 700, color: T.text, lineHeight: 1 }}>8</span>
        <PctBadge text="+2 types" up />
      </div>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {top3.map(t => (
          <span key={t.type} style={{
            padding: '2px 8px', borderRadius: '12px',
            backgroundColor: (typeColors[t.type] || T.primary) + '18',
            color: typeColors[t.type] || T.primary,
            fontSize: '11px', fontWeight: 600,
          }}>{t.type}</span>
        ))}
      </div>
      {top3.map(t => (
        <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
          <span style={{ width: '22px', fontSize: '10px', fontWeight: 600, color: T.sub }}>{t.type}</span>
          <div style={{ flex: 1, height: '7px', borderRadius: '4px', backgroundColor: '#F3F4F6' }}>
            <div style={{ height: '100%', width: `${(t.total / maxV) * 100}%`, borderRadius: '4px', backgroundColor: typeColors[t.type] || T.primary }} />
          </div>
          <span style={{ width: '18px', fontSize: '10px', color: T.sub, textAlign: 'right' }}>{t.total}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Card 2: Stock Health Gauge ──────────────────────────── */
function Card2() {
  const { inventory: bloodInventory } = useInventory();
  const safe = bloodInventory.filter(u => u.status === 'safe').reduce((s, u) => s + u.quantity, 0);
  const total = bloodInventory.reduce((s, u) => s + u.quantity, 0);
  const pct = Math.round((safe / total) * 100);
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <CardTop iconBg={T.secondaryLight} icon={Activity} title="Stock Health" />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '34px', fontWeight: 700, color: T.text, lineHeight: 1 }}>{pct}%</span>
        <PctBadge text="+3%" up />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
        <SegmentGauge value={pct} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', padding: '0 4px' }}>
        {['0', '25', '50', '75', '100'].map(n => (
          <span key={n} style={{ fontSize: '9px', color: '#D1D5DB' }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Card 3: Total Blood Units ───────────────────────────── */
function Card3({ onMore }: { onMore: () => void }) {
  const { inventory: bloodInventory } = useInventory();
  const total = bloodInventory.reduce((s, u) => s + u.quantity, 0);
  const safe = bloodInventory.filter(u => u.status === 'safe').reduce((s, u) => s + u.quantity, 0);
  const warn = bloodInventory.filter(u => u.status === 'warning').reduce((s, u) => s + u.quantity, 0);
  const crit = bloodInventory.filter(u => u.status === 'critical' || u.status === 'expired').reduce((s, u) => s + u.quantity, 0);
  const rows = [
    { label: 'Safe', value: safe, color: T.green },
    { label: 'Expiring', value: warn, color: T.orange },
    { label: 'Critical', value: crit, color: T.primary },
  ];
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <CardTop iconBg={T.primaryLight} icon={Package} title="Total Blood Units" onMore={onMore} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '34px', fontWeight: 700, color: T.text, lineHeight: 1 }}>{total}</span>
        <PctBadge text="+8.2%" up />
      </div>
      {rows.map(({ label, value, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
          <span style={{ width: '56px', fontSize: '11px', color: T.sub, flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, height: '8px', borderRadius: '4px', backgroundColor: '#F3F4F6' }}>
            <div style={{ height: '100%', width: `${(value / total) * 100}%`, borderRadius: '4px', backgroundColor: color }} />
          </div>
          <span style={{ width: '20px', fontSize: '11px', fontWeight: 600, color: T.text, textAlign: 'right' }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Card 4: Critical Alerts / Mini Chart ────────────────── */
function Card4({ onMore }: { onMore: () => void }) {
  const unread = alertsData.filter(a => !a.read).length;
  const months = ['S', 'O', 'N', 'D', 'J', 'F'];
  const vals = [45, 52, 48, 61, 55, 38];
  const maxV = Math.max(...vals);
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <CardTop iconBg={T.primaryLight} icon={AlertCircle} title="Critical Alerts" onMore={onMore} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '34px', fontWeight: 700, color: T.text, lineHeight: 1 }}>{unread}</span>
        <PctBadge text="+1 new" up={false} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '52px' }}>
        {vals.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              height: `${(v / maxV) * 46}px`,
              backgroundColor: i === vals.length - 1 ? T.primary : `${T.primary}45`,
            }} />
            <span style={{ fontSize: '8px', color: T.sub }}>{months[i]}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        {['02-07', '11-22', '17-22', '24-28'].map(l => (
          <span key={l} style={{ fontSize: '8px', color: '#D1D5DB' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Card 5: AI Forecast ─────────────────────────────────── */
function ForecastCard({ onMore }: { onMore: () => void }) {
  const items = [
    { label: 'O-', days: 3, confidence: 91, color: '#D32F2F' },
    { label: 'B-', days: 5, confidence: 76, color: '#E65100' },
    { label: 'AB+', days: 7, confidence: 82, color: '#7B1FA2' },
  ];
  const maxConf = Math.max(...items.map(i => i.confidence));
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <CardTop iconBg="#EDE7F6" icon={BrainCircuit} title="AI Forecast" onMore={onMore} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
        <span style={{ fontSize: '34px', fontWeight: 700, color: T.text, lineHeight: 1 }}>4</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '2px',
          padding: '2px 7px', borderRadius: '20px',
          backgroundColor: T.primaryLight, color: T.primary,
          fontSize: '10px', fontWeight: 600,
        }}>
          <TrendingDown size={9} />
          3 critical
        </span>
      </div>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {items.map(it => (
          <span key={it.label} style={{
            padding: '2px 8px', borderRadius: '12px',
            backgroundColor: it.color + '18', color: it.color,
            fontSize: '11px', fontWeight: 600,
          }}>{it.label}</span>
        ))}
      </div>

      {items.map(it => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
          <span style={{ width: '26px', fontSize: '10px', fontWeight: 600, color: T.sub }}>{it.label}</span>
          <div style={{ flex: 1, height: '7px', borderRadius: '4px', backgroundColor: '#F3F4F6' }}>
            <div style={{ height: '100%', width: `${(it.confidence / maxConf) * 100}%`, borderRadius: '4px', backgroundColor: it.color }} />
          </div>
          <span style={{ width: '22px', fontSize: '10px', color: T.sub, textAlign: 'right' }}>{it.days}d</span>
        </div>
      ))}
    </div>
  );
}

/* ── Expiry Calendar Strip ───────────────────────────────── */
function ExpiryStrip() {
  const [sel, setSel] = useState(20);
  const dateEvents: Record<number, { color: string; msg: string }> = {
    18: { color: '#9E9E9E', msg: '🗑 BU-008 (AB−, 1 bag) expired on Feb 18 — awaiting disposal.' },
    21: { color: T.primary, msg: '⚠️ BU-004 (B−, 2 bags) expires tomorrow — immediate action required.' },
    22: { color: T.primary, msg: '⚠️ BU-006 (O−, 3 bags) expires on Feb 22 — consider issuing or transferring.' },
    25: { color: T.orange, msg: '🕐 BU-002 (A−, 4 bags) expires on Feb 25 — plan for issuance.' },
  };
  const dates = Array.from({ length: 13 }, (_, i) => i + 18);

  return (
    <div style={{ ...CARD, padding: '16px 20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>
          Upcoming Expiry Dates — Feb 2026
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { dot: T.green, label: 'Available' },
            { dot: T.primary, label: 'Critical' },
            { dot: T.orange, label: 'Expiring' },
            { dot: '#9E9E9E', label: 'Expired' },
          ].map(({ dot, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: T.sub }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dot, display: 'inline-block', flexShrink: 0 }} />
              {label}
            </span>
          ))}
          <button style={{ fontSize: '11px', color: T.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
            View more <ChevronRight size={11} />
          </button>
        </div>
      </div>


      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ChevronLeft size={13} color={T.sub} />
        </button>

        <div style={{ flex: 1, display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
          {dates.map(d => {
            const ev = dateEvents[d];
            const isToday = d === 20;
            const isSel = d === sel;
            return (
              <button
                key={d}
                onClick={() => setSel(d)}
                style={{
                  flexShrink: 0, width: '44px', height: '56px', borderRadius: '26px',
                  border: isToday && !isSel ? `2px solid ${T.primary}` : '2px solid transparent',
                  backgroundColor: isSel ? T.primary : isToday ? T.primaryLight : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  transition: 'background-color 0.15s',
                }}
              >
                <span style={{
                  fontSize: '14px', lineHeight: 1,
                  fontWeight: isSel || isToday ? 700 : 400,
                  color: isSel ? '#fff' : isToday ? T.primary : T.text,
                }}>
                  {d}
                </span>

                {ev ? (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isSel ? 'rgba(255,255,255,0.8)' : ev.color, display: 'inline-block' }} />
                ) : isToday ? (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isSel ? 'rgba(255,255,255,0.8)' : T.green, display: 'inline-block' }} />
                ) : (
                  <span style={{ width: '6px', height: '6px' }} />
                )}
              </button>
            );
          })}
        </div>

        <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ChevronRight size={13} color={T.sub} />
        </button>
      </div>


      {dateEvents[sel] && (
        <div style={{
          marginTop: '10px', padding: '8px 14px', borderRadius: '8px',
          backgroundColor: dateEvents[sel].color === T.primary ? T.primaryLight : dateEvents[sel].color === T.orange ? T.orangeLight : '#F5F5F5',
          fontSize: '12px', color: T.sub,
        }}>
          {dateEvents[sel].msg}
        </div>
      )}
    </div>
  );
}

/* ── Status Pill ─────────────────────────────────────────── */
function SPill({ status }: { status: BloodStatus }) {
  const sc = getStatusColors(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      backgroundColor: sc.bg, color: sc.text,
      fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block', flexShrink: 0 }} />
      {sc.label}
    </span>
  );
}

/* ── Inventory Table ─────────────────────────────── */
function InventoryTable({ search }: { search: string }) {
  const navigate = useNavigate();
  const { inventory: bloodInventory } = useInventory();
  const typeColors: Record<string, string> = {
    'O+': T.primary, 'A+': T.secondary, 'B+': T.orange,
    'O-': '#8B0000', 'A-': '#00695C', 'B-': '#E65100',
    'AB+': '#7B1FA2', 'AB-': '#5D4037',
  };
  const rows = bloodInventory.filter(u =>
    !search ||
    u.id.toLowerCase().includes(search.toLowerCase()) ||
    u.type.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ ...CARD, overflow: 'hidden' }}>

      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>Blood Inventory</span>
        <span style={{ fontSize: '12px', color: T.sub }}>{rows.length} units · {rows.reduce((s, u) => s + u.quantity, 0)} bags</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              {[
                { label: 'Unit ID', w: 140 },
                { label: 'Blood Type', w: 90 },
                { label: 'Status', w: 110 },
                { label: 'Location', w: 150 },
                { label: 'Expiry', w: 120 },
                { label: 'Action', w: 100 },
              ].map(({ label, w }) => (
                <th key={label} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: '11px', color: T.sub, fontWeight: 600,
                  borderBottom: `1px solid ${T.border}`,
                  minWidth: `${w}px`,
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((unit, i) => {
              const bColor = typeColors[unit.type] || T.primary;
              const days = getDaysToExpiry(unit.expiryDate);
              return (
                <tr
                  key={unit.id}
                  style={{ borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : 'none', cursor: 'pointer' }}
                  onClick={() => navigate(`/inventory/${unit.id}`)}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                >

                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: bColor }}>{unit.type}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{unit.id}</span>
                    </div>
                  </td>

                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', backgroundColor: bColor + '18', color: bColor, fontSize: '12px', fontWeight: 700 }}>
                      {unit.type}
                    </span>
                  </td>

                  <td style={{ padding: '11px 16px' }}><SPill status={unit.status} /></td>

                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '12px', color: T.sub }}>{unit.location}</span>
                  </td>

                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: T.text }}>{unit.expiryDate}</div>
                    <div style={{ fontSize: '10px', color: days < 3 ? T.primary : days < 7 ? T.orange : T.sub }}>
                      {formatExpiryLabel(unit.expiryDate)}
                    </div>
                  </td>

                  <td style={{ padding: '11px 16px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button
                        onClick={() => navigate(`/inventory/${unit.id}`)}
                        title="View"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: T.primaryLight, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye size={12} color={T.primary} />
                      </button>
                      <button
                        title="Issue"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: T.secondaryLight, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Droplet size={12} color={T.secondary} />
                      </button>
                      <button
                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <MoreHorizontal size={12} color={T.sub} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Dashboard Page ──────────────────────────────────────── */
export function DashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('Monthly');

  return (
    <div style={{ padding: '20px 24px 32px', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.2 }}>
            Welcome back, Dr. Adeyemi! 🌟
          </h1>
          <p style={{ fontSize: '13px', color: T.sub, margin: '3px 0 0' }}>Friday, 20 February 2026 · General Hospital Lagos</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

          <div style={{ position: 'relative' }}>
            <Search size={14} color={T.sub} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', paddingRight: '10px', paddingTop: '8px', paddingBottom: '8px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, width: '160px', outline: 'none', backgroundColor: '#fff' }}
              onFocus={e => (e.target.style.borderColor = T.primary)}
              onBlur={e => (e.target.style.borderColor = T.border)}
            />
          </div>


          <div style={{ position: 'relative' }}>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={{ padding: '8px 28px 8px 12px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, backgroundColor: '#fff', cursor: 'pointer', outline: 'none', appearance: 'none' }}
            >
              {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(p => <option key={p}>{p}</option>)}
            </select>
            <ChevronRight size={12} color={T.sub} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
          </div>


          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            backgroundColor: T.primary, color: '#fff',
            border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
            boxShadow: `0 2px 8px ${T.primary}40`,
          }}>
            <Download size={14} />
            Export data
          </button>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
        <Card1 onMore={() => navigate('/inventory')} />
        <Card2 />
        <Card3 onMore={() => navigate('/inventory')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
        <Card4 onMore={() => navigate('/alerts')} />
        <ForecastCard onMore={() => navigate('/forecast')} />
      </div>


      <div style={{ marginBottom: '14px' }}>
        <ExpiryStrip />
      </div>


      <InventoryTable search={search} />
    </div>
  );
}