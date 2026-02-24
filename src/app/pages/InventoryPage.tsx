import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, PlusCircle, ChevronRight, Eye, Droplet, MoreHorizontal } from 'lucide-react';
import { getStatusColors, getDaysToExpiry, formatExpiryLabel, BloodStatus } from '../data/mockData';
import { useInventory } from '../context/InventoryContext';

const T = { primary: '#D32F2F', secondary: '#009688', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

const TYPES = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const STATUSES = [
  { label: 'All Status', value: 'all' },
  { label: 'Safe', value: 'safe' },
  { label: 'Warning', value: 'warning' },
  { label: 'Critical', value: 'critical' },
  { label: 'Expired', value: 'expired' },
];

function SPill({ status }: { status: BloodStatus }) {
  const sc = getStatusColors(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', backgroundColor: sc.bg, color: sc.text, fontSize: '11px', fontWeight: 600 }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }} />
      {sc.label}
    </span>
  );
}

export function InventoryPage() {
  const navigate = useNavigate();
  const { inventory: bloodInventory } = useInventory();
  const [search, setSearch] = useState('');
  const [selType, setSelType] = useState('All');
  const [selStatus, setSelStatus] = useState('all');
  const [view, setView] = useState<'table' | 'cards'>('table');

  const rows = bloodInventory.filter(u => {
    const ms = search === '' || u.id.toLowerCase().includes(search.toLowerCase()) || u.type.toLowerCase().includes(search.toLowerCase()) || u.donorId.toLowerCase().includes(search.toLowerCase()) || u.location.toLowerCase().includes(search.toLowerCase());
    const mt = selType === 'All' || u.type === selType;
    const mst = selStatus === 'all' || u.status === selStatus;
    return ms && mt && mst;
  });

  const typeColors: Record<string, string> = {
    'O+': '#D32F2F', 'A+': '#009688', 'B+': '#FF9800',
    'O-': '#8B0000', 'A-': '#00695C', 'B-': '#E65100',
    'AB+': '#7B1FA2', 'AB-': '#5D4037',
  };

  return (
    <div style={{ padding: '20px 24px 32px', maxWidth: '1300px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: T.text, margin: 0 }}>Blood Inventory</h1>
          <p style={{ fontSize: '13px', color: T.sub, margin: '3px 0 0' }}>{rows.length} units · {rows.reduce((s, u) => s + u.quantity, 0)} bags total</p>
        </div>
        <button
          onClick={() => navigate('/add-unit')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', backgroundColor: T.primary, color: '#fff', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: `0 2px 8px ${T.primary}40` }}
        >
          <PlusCircle size={15} />
          Add Unit
        </button>
      </div>


      <div style={{ ...CARD, padding: '16px 20px', marginBottom: '16px' }}>

        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={14} color={T.sub} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text" placeholder="Search by unit ID, blood type, donor ID, location..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '9px', paddingBottom: '9px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none', backgroundColor: '#FAFAFA' }}
            onFocus={e => (e.target.style.borderColor = T.primary)}
            onBlur={e => (e.target.style.borderColor = T.border)}
          />
        </div>


        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '10px', paddingBottom: '2px' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setSelType(t)}
              style={{ flexShrink: 0, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: selType === t ? 700 : 400, cursor: 'pointer', backgroundColor: selType === t ? T.primary : 'transparent', color: selType === t ? '#fff' : T.sub, border: `1px solid ${selType === t ? T.primary : T.border}`, transition: 'all 0.15s' }}
            >
              {t}
            </button>
          ))}
        </div>


        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {STATUSES.map(({ label, value }) => {
            const sc = value !== 'all' ? getStatusColors(value as BloodStatus) : null;
            const active = selStatus === value;
            return (
              <button key={value} onClick={() => setSelStatus(value)}
                style={{ flexShrink: 0, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: active ? 700 : 400, cursor: 'pointer', backgroundColor: active ? (sc?.dot || T.secondary) : 'transparent', color: active ? '#fff' : T.sub, border: `1px solid ${active ? (sc?.dot || T.secondary) : T.border}`, transition: 'all 0.15s' }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>


      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Safe', count: bloodInventory.filter(u => u.status === 'safe').length, color: '#4CAF50', bg: '#E8F5E9' },
          { label: 'Warning', count: bloodInventory.filter(u => u.status === 'warning').length, color: '#FFC107', bg: '#FFF8E1' },
          { label: 'Critical', count: bloodInventory.filter(u => u.status === 'critical').length, color: '#F44336', bg: '#FFEBEE' },
          { label: 'Expired', count: bloodInventory.filter(u => u.status === 'expired').length, color: '#9E9E9E', bg: '#F5F5F5' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', backgroundColor: bg, border: `1px solid ${color}20` }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
            <span style={{ fontSize: '12px', color: T.sub }}>{label}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: T.text }}>{count}</span>
          </div>
        ))}
      </div>


      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                {['Unit ID', 'Blood Type', 'Qty', 'Donor ID', 'Status', 'Location', 'Received', 'Expiry', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: T.sub, fontWeight: 600, borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: T.sub, fontSize: '14px' }}>
                    No units found matching your filters.
                  </td>
                </tr>
              ) : rows.map((unit, i) => {
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
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, color: bColor }}>{unit.type}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{unit.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', backgroundColor: bColor + '18', color: bColor, fontSize: '12px', fontWeight: 700 }}>{unit.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{unit.quantity}</span>
                      <span style={{ fontSize: '11px', color: T.sub }}> bags</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', color: T.sub, fontFamily: 'monospace' }}>{unit.donorId}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}><SPill status={unit.status} /></td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '12px', color: T.sub }}>{unit.location}</span></td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '12px', color: T.sub }}>{unit.receivedDate}</span></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: T.text }}>{unit.expiryDate}</div>
                      <div style={{ fontSize: '10px', color: days < 3 ? T.primary : days < 7 ? '#FF9800' : T.sub }}>{formatExpiryLabel(unit.expiryDate)}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => navigate(`/inventory/${unit.id}`)} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FFEBEE', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View">
                          <Eye size={12} color={T.primary} />
                        </button>
                        <button style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E0F2F1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Issue">
                          <Droplet size={12} color={T.secondary} />
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
    </div>
  );
}