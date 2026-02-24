import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Droplet, Calendar, User, MapPin, Clock,
  Edit2, Share2, Trash2, CheckCircle, AlertTriangle, AlertCircle,
  Package, Info,
} from 'lucide-react';
import { getStatusColors, getDaysToExpiry, formatExpiryLabel } from '../data/mockData';
import { useInventory } from '../context/InventoryContext';

const T = { primary: '#D32F2F', secondary: '#009688', orange: '#FF9800', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

const typeColors: Record<string, string> = {
  'O+': '#D32F2F', 'A+': '#009688', 'B+': '#FF9800',
  'O-': '#8B0000', 'A-': '#00695C', 'B-': '#E65100',
  'AB+': '#7B1FA2', 'AB-': '#5D4037',
};

const unitHistory = [
  { date: 'Feb 20, 2026', time: '09:00 AM', event: 'Status checked — No issues found', type: 'info' },
  { date: 'Feb 15, 2026', time: '02:30 PM', event: 'Unit transferred from donation center', type: 'transfer' },
  { date: 'Feb 14, 2026', time: '10:00 AM', event: 'Compatibility test completed — Passed', type: 'success' },
  { date: 'Feb 14, 2026', time: '08:00 AM', event: 'Unit received from donor', type: 'received' },
];

function HistoryDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = { success: '#4CAF50', transfer: T.secondary, info: '#2196F3', received: T.orange };
  return <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorMap[type] || T.sub, flexShrink: 0 }} />;
}

export function BloodUnitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inventory } = useInventory();
  const [showIssue, setShowIssue] = useState(false);
  const [issuedTo, setIssuedTo] = useState('');
  const [issued, setIssued] = useState(false);

  const unit = inventory.find(u => u.id === id);

  if (!unit) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', fontFamily: "'Roboto', sans-serif" }}>
      <AlertCircle size={40} color="#F44336" />
      <p style={{ fontSize: '16px', fontWeight: 600, color: T.text }}>Unit not found</p>
      <button onClick={() => navigate('/inventory')} style={{ padding: '9px 20px', borderRadius: '8px', backgroundColor: T.primary, color: '#fff', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}>Back to Inventory</button>
    </div>
  );

  const sc = getStatusColors(unit.status);
  const days = getDaysToExpiry(unit.expiryDate);
  const bColor = typeColors[unit.type] || T.primary;

  const handleIssue = () => {
    setIssued(true);
    setTimeout(() => { setShowIssue(false); setIssued(false); setIssuedTo(''); navigate('/inventory'); }, 1600);
  };

  return (
    <div style={{ padding: '20px 24px 32px', maxWidth: '720px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={T.text} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: T.text, margin: 0, flex: 1 }}>Unit Details</h1>
        <button style={{ width: '36px', height: '36px', borderRadius: '10px', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Edit2 size={15} color={T.secondary} />
        </button>
      </div>


      <div style={{ ...CARD, padding: '22px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: bColor + '10' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>

          <div style={{ width: '72px', height: '72px', borderRadius: '16px', backgroundColor: bColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: bColor }}>{unit.type}</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: T.text, lineHeight: 1, marginBottom: '6px' }}>{unit.id}</div>


            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', backgroundColor: sc.bg, color: sc.text, fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }} />
              {sc.label}
            </span>


            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#F3F4F6', marginLeft: '6px', marginBottom: '8px' }}>
              <Clock size={11} color={T.sub} />
              <span style={{ fontSize: '11px', color: T.sub, fontWeight: 500 }}>{formatExpiryLabel(unit.expiryDate)}</span>
            </div>


            {unit.notes && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '4px' }}>
                <AlertTriangle size={12} color={T.orange} style={{ marginTop: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: T.sub }}>{unit.notes}</span>
              </div>
            )}
          </div>
        </div>


        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', backgroundColor: sc.bg, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={18} color={sc.dot} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: sc.text }}>
              {days < 0 ? `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`
                : days === 0 ? 'Expires today!'
                  : `${days} day${days !== 1 ? 's' : ''} until expiry`}
            </div>
            <div style={{ fontSize: '11px', color: T.sub }}>Expiry date: {unit.expiryDate}</div>
          </div>
        </div>
      </div>


      <div style={{ ...CARD, overflow: 'hidden', marginBottom: '14px' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>Unit Information</span>
        </div>
        {[
          { icon: Droplet, label: 'Blood Type', value: unit.type, color: bColor },
          { icon: Package, label: 'Quantity', value: `${unit.quantity} bag${unit.quantity !== 1 ? 's' : ''}`, color: T.text },
          { icon: User, label: 'Donor ID', value: unit.donorId, color: T.text },
          { icon: Calendar, label: 'Received Date', value: unit.receivedDate, color: T.text },
          { icon: Calendar, label: 'Expiry Date', value: unit.expiryDate, color: sc.text },
          { icon: MapPin, label: 'Storage Location', value: unit.location, color: T.text },
        ].map(({ icon: Icon, label, value, color }, i, arr) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={14} color={T.sub} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: T.sub }}>{label}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>


      <div style={{ ...CARD, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>Unit History</span>
        </div>
        <div style={{ padding: '16px 20px', position: 'relative' }}>

          <div style={{ position: 'absolute', left: '30px', top: '20px', bottom: '20px', width: '1px', backgroundColor: T.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {unitHistory.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff', border: `2px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <HistoryDot type={h.type} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: T.text }}>{h.event}</div>
                  <div style={{ fontSize: '11px', color: T.sub, marginTop: '2px' }}>{h.date} · {h.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setShowIssue(true)}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: T.primary, color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: `0 3px 10px ${T.primary}40` }}
        >
          <Droplet size={17} /> Issue Blood
        </button>
        <button
          onClick={() => navigate('/sharing')}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: T.secondary, color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: `0 3px 10px ${T.secondary}40` }}
        >
          <Share2 size={17} /> Share Unit
        </button>
        <button style={{ width: '48px', height: '48px', borderRadius: '10px', border: `1.5px solid #FFCDD2`, backgroundColor: '#FFEBEE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trash2 size={17} color="#F44336" />
        </button>
      </div>


      {showIssue && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={e => e.target === e.currentTarget && setShowIssue(false)}>
          <div style={{ width: '100%', maxWidth: '380px', borderRadius: '16px', backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            {issued ? (
              <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={28} color="#4CAF50" />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: T.text, textAlign: 'center' }}>Blood Issued Successfully</div>
                <div style={{ fontSize: '13px', color: T.sub, textAlign: 'center' }}>Unit {unit.id} issued to {issuedTo}</div>
              </div>
            ) : (
              <>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: T.text }}>Issue Blood Unit</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F9FAFB', marginBottom: '16px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: bColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: bColor }}>{unit.type}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{unit.id}</div>
                      <div style={{ fontSize: '11px', color: T.sub }}>{unit.quantity} bag(s) available</div>
                    </div>
                  </div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>Issue To *</label>
                  <input
                    type="text" placeholder="Ward / Department / Patient ID"
                    value={issuedTo} onChange={e => setIssuedTo(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none', marginBottom: '16px' }}
                    onFocus={e => (e.target.style.borderColor = T.secondary)}
                    onBlur={e => (e.target.style.borderColor = T.border)}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowIssue(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: `1px solid ${T.border}`, color: T.sub, fontSize: '13px', cursor: 'pointer', backgroundColor: 'transparent' }}>Cancel</button>
                    <button onClick={handleIssue} disabled={!issuedTo} style={{ flex: 1, padding: '11px', borderRadius: '8px', backgroundColor: issuedTo ? T.primary : '#D1D5DB', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: issuedTo ? 'pointer' : 'not-allowed' }}>Confirm Issue</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}