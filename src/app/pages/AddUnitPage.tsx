import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ScanLine, Camera, ChevronDown, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { BloodStatus } from '../data/mockData';

const T = { primary: '#D32F2F', secondary: '#009688', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const LOCATIONS = ['Blood Bank Main', 'Emergency Ward', 'ICU', 'Ward A', 'Ward B', 'Surgery Ward', 'Maternity Ward', 'Paediatrics Ward'];

interface Form { bloodType: string; quantity: string; donorId: string; receivedDate: string; expiryDate: string; location: string; notes: string; }
const EMPTY: Form = { bloodType: '', quantity: '1', donorId: '', receivedDate: '2026-02-20', expiryDate: '', location: '', notes: '' };

const typeColors: Record<string, string> = {
  'O+': '#D32F2F', 'A+': '#009688', 'B+': '#FF9800',
  'O-': '#8B0000', 'A-': '#00695C', 'B-': '#E65100',
  'AB+': '#7B1FA2', 'AB-': '#5D4037',
};

export function AddUnitPage() {
  const navigate = useNavigate();
  const { addUnit } = useInventory();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [scanning, setScanning] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k: keyof Form, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false); setMode('manual');
      setForm({ bloodType: 'O+', quantity: '3', donorId: 'D-9999', receivedDate: '2026-02-20', expiryDate: '2026-04-20', location: 'Blood Bank Main', notes: 'Auto-filled via barcode scan' });
    }, 2000);
  };

  const validate = () => {
    const e: Partial<Form> = {};
    if (!form.bloodType) e.bloodType = 'Required';
    if (!form.donorId) e.donorId = 'Required';
    if (!form.expiryDate) e.expiryDate = 'Required';
    if (!form.location) e.location = 'Required';
    if (!form.quantity || parseInt(form.quantity) < 1) e.quantity = 'Must be ≥ 1';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    // Determine status based on expiry date
    const today = new Date('2026-02-20');
    const expiry = new Date(form.expiryDate);
    const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let status: BloodStatus = 'safe';
    if (daysLeft < 0) status = 'expired';
    else if (daysLeft <= 3) status = 'critical';
    else if (daysLeft <= 7) status = 'warning';

    // Generate a unique ID
    const newId = `BU-${String(Date.now()).slice(-4)}`;

    const newUnit = {
      id: newId,
      type: form.bloodType,
      quantity: parseInt(form.quantity) || 1,
      donorId: form.donorId,
      receivedDate: form.receivedDate,
      expiryDate: form.expiryDate,
      status,
      location: form.location,
      notes: form.notes || undefined,
    };

    addUnit(newUnit);

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    }, 1200);
  };

  if (success) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: "'Roboto', sans-serif" }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <CheckCircle size={36} color="#4CAF50" />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: T.text, margin: '0 0 6px', textAlign: 'center' }}>Unit Added Successfully!</h2>
      <p style={{ fontSize: '14px', color: T.sub, textAlign: 'center', margin: '0 0 12px' }}>
        Blood type <strong>{form.bloodType}</strong> · {form.quantity} bag(s) added to inventory.
      </p>
      <span style={{ padding: '4px 14px', borderRadius: '20px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', fontWeight: 500 }}>
        Syncing to all systems...
      </span>
    </div>
  );

  return (
    <div style={{ padding: '20px 24px 40px', maxWidth: '680px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: `1px solid ${T.border}`, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={T.text} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: T.text, margin: 0 }}>Add Blood Unit</h1>
          <p style={{ fontSize: '12px', color: T.sub, margin: '2px 0 0' }}>Register a new blood unit to inventory</p>
        </div>

        <div style={{ display: 'flex', gap: '3px', padding: '3px', borderRadius: '10px', backgroundColor: '#F3F4F6' }}>
          {(['scan', 'manual'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: mode === m ? 700 : 400, cursor: 'pointer', backgroundColor: mode === m ? '#fff' : 'transparent', color: mode === m ? T.secondary : T.sub, border: 'none', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', textTransform: 'capitalize' }}>
              {m}
            </button>
          ))}
        </div>
      </div>


      {mode === 'scan' && (
        <div style={{ ...CARD, overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ height: '240px', backgroundColor: '#1A1A2E', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {[['top-0 left-0 border-t-2 border-l-2', 0], ['top-0 right-0 border-t-2 border-r-2', 1], ['bottom-0 left-0 border-b-2 border-l-2', 2], ['bottom-0 right-0 border-b-2 border-r-2', 3]].map(([cls, k]) => (
              <div key={k as number} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: T.secondary, margin: '40px' }} />
            ))}

            {scanning && <div style={{ position: 'absolute', left: 'calc(50% - 60px)', right: 'calc(50% - 60px)', height: '2px', backgroundColor: T.secondary, animation: 'bounce 1s infinite', top: '50%' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {scanning
                ? <ScanLine size={28} color={T.secondary} style={{ animation: 'pulse 1s infinite' }} />
                : <Camera size={28} color="rgba(255,255,255,0.3)" />}
              <span style={{ color: scanning ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                {scanning ? 'Scanning barcode...' : 'Point camera at blood bag barcode'}
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 16px', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>ZXing barcode scanner</span>
              <span style={{ color: T.secondary, fontSize: '11px', fontWeight: 600 }}>Ready</span>
            </div>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', gap: '10px' }}>
            <button onClick={handleScan} disabled={scanning}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: scanning ? '#D1D5DB' : T.secondary, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: scanning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {scanning
                ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Scanning...</>
                : <><ScanLine size={15} />Simulate Scan</>}
            </button>
            <button onClick={() => setMode('manual')} style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${T.border}`, color: T.sub, fontSize: '13px', cursor: 'pointer', backgroundColor: 'transparent' }}>
              Manual Entry
            </button>
          </div>
        </div>
      )}


      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>Unit Details</span>
        </div>
        <div style={{ padding: '20px' }}>


          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '10px' }}>🩸 Blood Type *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BLOOD_TYPES.map(type => {
                const c = typeColors[type] || T.primary;
                const sel = form.bloodType === type;
                return (
                  <button key={type} onClick={() => update('bloodType', type)}
                    style={{ padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: sel ? 700 : 400, cursor: 'pointer', backgroundColor: sel ? c : 'transparent', color: sel ? '#fff' : T.sub, border: `1.5px solid ${sel ? c : T.border}`, transition: 'all 0.15s' }}>
                    {type}
                  </button>
                );
              })}
            </div>
            {errors.bloodType && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><AlertCircle size={11} color="#F44336" /><span style={{ fontSize: '11px', color: '#F44336' }}>{errors.bloodType}</span></div>}
          </div>


          <div style={{ marginBottom: '18px', paddingBottom: '18px', borderBottom: `1px solid ${T.border}` }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '8px' }}>📦 Quantity (bags) *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => update('quantity', String(Math.max(1, parseInt(form.quantity || '1') - 1)))} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.text }}>−</button>
              <input type="number" min={1} max={100} value={form.quantity} onChange={e => update('quantity', e.target.value)} style={{ width: '72px', textAlign: 'center', padding: '8px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '16px', fontWeight: 700, color: T.text, outline: 'none' }} />
              <button onClick={() => update('quantity', String(parseInt(form.quantity || '1') + 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.text }}>+</button>
              <span style={{ fontSize: '12px', color: T.sub }}>bags</span>
            </div>
          </div>


          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>👤 Donor ID *</label>
            <input type="text" placeholder="e.g. D-1234" value={form.donorId} onChange={e => update('donorId', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.donorId ? '#F44336' : T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = errors.donorId ? '#F44336' : T.border)} />
            {errors.donorId && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><AlertCircle size={11} color="#F44336" /><span style={{ fontSize: '11px', color: '#F44336' }}>{errors.donorId}</span></div>}
          </div>


          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>📅 Received Date</label>
              <input type="date" value={form.receivedDate} onChange={e => update('receivedDate', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>⏰ Expiry Date *</label>
              <input type="date" value={form.expiryDate} onChange={e => update('expiryDate', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.expiryDate ? '#F44336' : T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = errors.expiryDate ? '#F44336' : T.border)} />
              {errors.expiryDate && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><AlertCircle size={11} color="#F44336" /><span style={{ fontSize: '11px', color: '#F44336' }}>{errors.expiryDate}</span></div>}
            </div>
          </div>


          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>📍 Storage Location *</label>
            <div style={{ position: 'relative' }}>
              <select value={form.location} onChange={e => update('location', e.target.value)}
                style={{ width: '100%', padding: '9px 32px 9px 12px', border: `1px solid ${errors.location ? '#F44336' : T.border}`, borderRadius: '8px', fontSize: '13px', color: form.location ? T.text : T.sub, outline: 'none', appearance: 'none', backgroundColor: '#fff' }}>
                <option value="">Select location...</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={14} color={T.sub} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
            {errors.location && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><AlertCircle size={11} color="#F44336" /><span style={{ fontSize: '11px', color: '#F44336' }}>{errors.location}</span></div>}
          </div>


          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>📝 Notes (optional)</label>
            <textarea placeholder="Any special notes about this unit..." value={form.notes} onChange={e => update('notes', e.target.value)} rows={3}
              style={{ width: '100%', padding: '9px 12px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, outline: 'none', resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)} />
          </div>


          <div style={{ marginTop: '24px' }}>
            <button onClick={handleSave} disabled={saving}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '10px', backgroundColor: saving ? '#D1D5DB' : T.primary, color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : `0 3px 10px ${T.primary}40`, transition: 'background-color 0.2s' }}>
              {saving
                ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Saving & Syncing...</>
                : <><Save size={16} />Add Blood Unit</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}