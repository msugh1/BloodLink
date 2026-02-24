import React, { useState } from 'react';
import { Building2, MapPin, Phone, ChevronDown, Search, CheckCircle, X, Droplets } from 'lucide-react';
import { hospitalsData, getStatusColors, formatExpiryLabel, BloodStatus } from '../data/mockData';

const T = { primary: '#D32F2F', secondary: '#009688', orange: '#FF9800', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };
const TYPES = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function RequestModal({ hospitalName, bloodType, quantity, onClose }: { hospitalName: string; bloodType: string; quantity: number; onClose: () => void; }) {
  const [done, setDone] = useState(false);
  const [qty, setQty] = useState(1);
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Urgent');

  if (done) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div style={{ width: '320px', borderRadius: '16px', backgroundColor: '#fff', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={28} color="#4CAF50" />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: T.text, textAlign: 'center' }}>Request Sent!</div>
        <div style={{ fontSize: '13px', color: T.sub, textAlign: 'center' }}>
          {qty} bag(s) of <strong>{bloodType}</strong> requested from {hospitalName}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0', backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: '440px', borderRadius: '16px 16px 0 0', backgroundColor: '#fff', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', marginBottom: '4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#E5E7EB' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 14px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: T.text }}>Request Blood Unit</span>
          <button onClick={onClose} style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color={T.sub} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: '11px', color: T.sub, marginBottom: '4px' }}>From</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '8px' }}>{hospitalName}</div>
            <span style={{ padding: '3px 12px', borderRadius: '12px', backgroundColor: '#FFEBEE', color: T.primary, fontSize: '13px', fontWeight: 700 }}>
              {bloodType} · {quantity} bags available
            </span>
          </div>


          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: T.text, display: 'block', marginBottom: '8px' }}>How many bags?</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <input type="number" min={1} max={quantity} value={qty} onChange={e => setQty(Math.min(quantity, Math.max(1, parseInt(e.target.value) || 1)))} style={{ width: '60px', textAlign: 'center', padding: '7px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '15px', fontWeight: 700, color: T.text, outline: 'none' }} />
              <button onClick={() => setQty(Math.min(quantity, qty + 1))} style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              <span style={{ fontSize: '12px', color: T.sub }}>of {quantity} available</span>
            </div>
          </div>


          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: T.text, display: 'block', marginBottom: '8px' }}>Urgency</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['Routine', 'Urgent', 'Emergency'] as const).map(u => (
                <button key={u} onClick={() => setUrgency(u)} style={{
                  flex: 1, padding: '7px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: `1.5px solid ${urgency === u ? T.primary : T.border}`, backgroundColor: urgency === u ? '#FFEBEE' : 'transparent', color: urgency === u ? T.primary : T.sub, fontWeight: urgency === u ? 600 : 400,
                }}>
                  {u}
                </button>
              ))}
            </div>
          </div>


          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: `1px solid ${T.border}`, color: T.sub, fontSize: '13px', cursor: 'pointer', backgroundColor: 'transparent' }}>Cancel</button>
            <button onClick={() => { setDone(true); setTimeout(onClose, 2200); }} style={{ flex: 1, padding: '11px', borderRadius: '8px', backgroundColor: T.secondary, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>Send Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SharingPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>('H-001');
  const [modal, setModal] = useState<{ hospitalName: string; bloodType: string; quantity: number } | null>(null);

  const hospitals = hospitalsData.map(h => ({
    ...h,
    availableUnits: h.availableUnits.filter(u => {
      const mt = typeFilter === 'All' || u.type === typeFilter;
      const ms = !search || u.type.toLowerCase().includes(search.toLowerCase());
      return mt && ms;
    }),
  })).filter(h => h.availableUnits.length > 0 || !search);

  const hospitalColors = ['#D32F2F', '#009688', '#FF9800', '#7B1FA2'];
  const hospitalInitials = (name: string) => name.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <div style={{ padding: '20px 24px 32px', maxWidth: '900px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '21px', fontWeight: 700, color: T.text, margin: 0 }}>Inter-Hospital Sharing</h1>
        <p style={{ fontSize: '13px', color: T.sub, margin: '3px 0 0' }}>Real-time blood availability from partner hospitals in Lagos</p>
      </div>


      <div style={{ ...CARD, padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={14} color={T.sub} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input type="text" placeholder="Search blood type..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '9px', paddingBottom: '9px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none', backgroundColor: '#FAFAFA' }}
            onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)} />
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ flexShrink: 0, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: typeFilter === t ? 700 : 400, cursor: 'pointer', backgroundColor: typeFilter === t ? T.primary : 'transparent', color: typeFilter === t ? '#fff' : T.sub, border: `1px solid ${typeFilter === t ? T.primary : T.border}`, transition: 'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>
      </div>


      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#E3F2FD', border: '1px solid #90CAF9', marginBottom: '16px', fontSize: '12px', color: '#1565C0' }}>
        <Droplets size={14} color="#1976D2" />
        <strong>{hospitalsData.length} partner hospitals</strong> connected · Showing real-time availability
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {hospitals.map((h, hi) => {
          const hColor = hospitalColors[hi % hospitalColors.length];
          const hInit = hospitalInitials(h.name);
          const isExp = expanded === h.id;
          return (
            <div key={h.id} style={{ ...CARD, overflow: 'hidden' }}>

              <button
                onClick={() => setExpanded(isExp ? null : h.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >

                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: hColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: hColor }}>{hInit}</span>
                </div>

                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: T.text }}>{h.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={10} color={T.sub} />
                    <span style={{ fontSize: '12px', color: T.sub }}>{h.location} · {h.distance}</span>
                  </div>
                  <span style={{ display: 'inline-block', marginTop: '5px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '11px', fontWeight: 600 }}>
                    {h.availableUnits.length} type{h.availableUnits.length !== 1 ? 's' : ''} available
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <a href={`tel:${h.contact}`} onClick={e => e.stopPropagation()}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', backgroundColor: '#E0F2F1', textDecoration: 'none' }}>
                    <Phone size={11} color={T.secondary} />
                    <span style={{ fontSize: '11px', color: T.secondary, fontWeight: 500 }}>Call</span>
                  </a>
                  <ChevronDown size={16} color={T.sub} style={{ transform: isExp ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </div>
              </button>


              {isExp && h.availableUnits.map((unit, ui) => {
                const sc = getStatusColors(unit.status);
                return (
                  <div key={ui} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', borderTop: `1px solid ${T.border}`, backgroundColor: '#FAFAFA' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: sc.text }}>{unit.type}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{unit.type}</span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: sc.text, fontWeight: 600 }}>{sc.label}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: T.sub }}>
                        <strong style={{ color: T.text }}>{unit.quantity}</strong> bags · {formatExpiryLabel(unit.expiryDate)}
                      </div>
                    </div>
                    <button
                      onClick={() => setModal({ hospitalName: h.name, bloodType: unit.type, quantity: unit.quantity })}
                      style={{ padding: '7px 18px', borderRadius: '8px', backgroundColor: T.secondary, color: '#fff', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: `0 2px 6px ${T.secondary}40` }}
                    >
                      Request
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}

        {hospitals.every(h => h.availableUnits.length === 0) && (
          <div style={{ ...CARD, padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Droplets size={32} color="#D1D5DB" />
            <p style={{ fontSize: '14px', color: T.sub, margin: 0 }}>No matching units found</p>
            <button onClick={() => { setTypeFilter('All'); setSearch(''); }} style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: T.secondary, color: '#fff', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {modal && <RequestModal {...modal} onClose={() => setModal(null)} />}
    </div>
  );
}
