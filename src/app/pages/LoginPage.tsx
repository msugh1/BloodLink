import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Droplets, Eye, EyeOff, Lock, User, AlertCircle, Fingerprint } from 'lucide-react';

const T = { primary: '#D32F2F', secondary: '#009688', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'officer' | 'doctor' | 'admin'>('officer');

  const roles = {
    officer: { label: 'Blood Bank Officer', user: 'bbo.adeyemi' },
    doctor: { label: 'Doctor', user: 'dr.okafor' },
    admin: { label: 'Admin', user: 'admin.lagos' },
  };

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Please enter your username and password.'); return; }
    setError(''); setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1100);
  };

  const demoLogin = () => {
    setUsername(roles[role].user); setPassword('BloodLink2026'); setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Roboto', sans-serif" }}>

      <div
        className="hidden lg:flex flex-col justify-between"
        style={{ width: '42%', background: 'linear-gradient(160deg, #C62828 0%, #B71C1C 55%, #7B1111 100%)', padding: '40px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '60px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />


        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>BloodLink</span>
        </div>


        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '34px', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: '14px' }}>
            Saving Lives,<br />One Unit at a Time
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: '320px', marginBottom: '32px' }}>
            Real-time blood bank management for Nigerian hospitals — inventory, inter-hospital sharing, and critical alerts, all offline-capable.
          </p>

          <div style={{ display: 'flex', gap: '36px' }}>
            {[{ v: '4', l: 'Partner Hospitals' }, { v: '59', l: 'Units in Stock' }, { v: '<5m', l: 'Sync Interval' }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4CAF50', animation: 'pulse 2s infinite' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>General Hospital Lagos · Online</span>
        </div>
      </div>


      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', backgroundColor: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(211,47,47,0.4)' }}>
              <Droplets size={17} color="#fff" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: T.text }}>BloodLink</span>
          </div>


          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${T.border}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: T.text, margin: '0 0 4px' }}>Welcome back 👋</h2>
            <p style={{ fontSize: '13px', color: T.sub, margin: '0 0 20px' }}>Sign in to your BloodLink account</p>


            <div style={{ display: 'flex', gap: '2px', padding: '4px', borderRadius: '10px', backgroundColor: '#F3F4F6', marginBottom: '20px' }}>
              {(Object.keys(roles) as Array<keyof typeof roles>).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: '8px',
                    backgroundColor: role === r ? '#fff' : 'transparent',
                    color: role === r ? T.primary : T.sub,
                    fontWeight: role === r ? 600 : 400, fontSize: '11px',
                    border: 'none', cursor: 'pointer',
                    boxShadow: role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {roles[r].label}
                </button>
              ))}
            </div>


            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2', marginBottom: '16px' }}>
                <AlertCircle size={15} color="#D32F2F" />
                <span style={{ fontSize: '12px', color: '#B71C1C' }}>{error}</span>
              </div>
            )}


            <form onSubmit={doLogin}>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>Username / Staff ID</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="#D1D5DB" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text" value={username} onChange={e => setUsername(e.target.value)}
                    placeholder={`e.g. ${roles[role].user}`}
                    style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, backgroundColor: '#FAFAFA', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = T.primary)}
                    onBlur={e => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>


              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#D1D5DB" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ width: '100%', paddingLeft: '34px', paddingRight: '36px', paddingTop: '10px', paddingBottom: '10px', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '13px', color: T.text, backgroundColor: '#FAFAFA', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = T.primary)}
                    onBlur={e => (e.target.style.borderColor = T.border)}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                    {showPw ? <EyeOff size={15} color="#9CA3AF" /> : <Eye size={15} color="#9CA3AF" />}
                  </button>
                </div>
              </div>


              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '12px', color: T.sub }} onClick={() => setRemember(!remember)}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '4px', border: remember ? 'none' : `1.5px solid #D1D5DB`, backgroundColor: remember ? T.secondary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {remember && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  Remember me
                </label>
                <button type="button" style={{ fontSize: '12px', color: T.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Forgot password?</button>
              </div>


              <button
                type="submit" disabled={loading}
                style={{ width: '100%', padding: '11px', borderRadius: '8px', backgroundColor: loading ? '#D1D5DB' : T.primary, color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 3px 10px ${T.primary}40`, marginBottom: '12px' }}
              >
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
                    Signing In...
                  </span>
                  : 'Sign In'}
              </button>


              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
                <span style={{ fontSize: '11px', color: '#D1D5DB' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
              </div>


              <button
                type="button"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#F0FDFC', border: `1.5px solid ${T.secondary}`, color: T.secondary, fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
              >
                <Fingerprint size={16} />
                Sign in with Biometrics
              </button>
            </form>
          </div>

          {/* Demo card */}
          <div style={{ marginTop: '14px', padding: '14px 18px', borderRadius: '12px', backgroundColor: '#1A1A2E', border: '1px solid #2D2D4E' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>🔑 Demo Credentials</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{roles[role].label}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '10px' }}>
              User: <strong style={{ color: '#fff' }}>{roles[role].user}</strong> · Pass: <strong style={{ color: '#fff' }}>BloodLink2026</strong>
            </div>
            <button
              onClick={demoLogin}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', backgroundColor: T.primary, color: '#fff', fontWeight: 600, fontSize: '12px', border: 'none', cursor: 'pointer' }}
            >
              Use Demo Account →
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#D1D5DB' }}>
            BloodLink v1.0.0 · NMSA Compliant
          </div>
        </div>
      </div>
    </div>
  );
}