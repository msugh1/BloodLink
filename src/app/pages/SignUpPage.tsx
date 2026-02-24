import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Droplets, Eye, EyeOff, Lock, User, Mail, Building2,
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft, ChevronDown,
} from 'lucide-react';

const T = {
  red: '#D32F2F', redDark: '#B71C1C', redLight: '#FFEBEE',
  teal: '#009688', tealDark: '#00695C',
  green: '#4CAF50',
  text: '#111827', sub: '#6B7280', border: '#E5E7EB', bg: '#F8FAFC',
};

const roles = [
  { value: 'officer', label: 'Blood Bank Officer', desc: 'Manage inventory, add/dispense units, handle transfers' },
  { value: 'doctor', label: 'Doctor', desc: 'Request blood units, view availability' },
  { value: 'admin', label: 'Hospital Admin', desc: 'Full access, user management, reports' },
];

const hospitals = [
  'Lagos University Teaching Hospital (LUTH)',
  'Lagos State General Hospital',
  'Lagos Island General Hospital',
  'Eko Hospital',
  'University College Hospital (UCH) Ibadan',
  'National Hospital Abuja',
  'NAUTH, Nnewi',
  'OAUTH Teaching Hospital',
  'Other',
];

/* ── Shared field components ─────────────────────────────── */
function InputField({
  label, icon: Icon, type = 'text', value, onChange, placeholder, error, suffix,
}: {
  label: string; icon: React.ElementType; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        border: `1.5px solid ${error ? '#F44336' : focused ? T.red : T.border}`,
        borderRadius: '10px', padding: '0 14px',
        backgroundColor: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(244,67,54,0.12)' : 'rgba(211,47,47,0.12)'}` : 'none',
      }}>
        <Icon size={16} color={focused ? T.red : '#9CA3AF'} style={{ flexShrink: 0 }} />
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: T.text, padding: '12px 0', backgroundColor: 'transparent' }}
        />
        {suffix}
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
          <AlertCircle size={12} color="#F44336" />
          <span style={{ fontSize: '11px', color: '#F44336' }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function SelectField({ label, icon: Icon, value, onChange, options, placeholder }: {
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '6px' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        border: `1.5px solid ${focused ? T.red : T.border}`,
        borderRadius: '10px', padding: '0 14px',
        backgroundColor: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focused ? '0 0 0 3px rgba(211,47,47,0.12)' : 'none',
      }}>
        <Icon size={16} color={focused ? T.red : '#9CA3AF'} style={{ flexShrink: 0 }} />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', fontSize: '14px',
            color: value ? T.text : '#9CA3AF', padding: '12px 0',
            backgroundColor: 'transparent', cursor: 'pointer',
            appearance: 'none', WebkitAppearance: 'none',
          }}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} color="#9CA3AF" style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['#E5E7EB', '#F44336', '#FF9800', '#FFC107', '#4CAF50'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= score ? colors[score] : '#E5E7EB', transition: 'background-color 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {checks.map(({ label, pass }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: pass ? T.green : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {pass && <CheckCircle size={8} color="#fff" />}
              </div>
              <span style={{ fontSize: '11px', color: pass ? T.green : '#9CA3AF' }}>{label}</span>
            </div>
          ))}
        </div>
        {score > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color: colors[score], flexShrink: 0 }}>{labels[score]}</span>}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export function SignUpPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [hospital, setHospital] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!hospital) e.hospital = 'Please select your hospital';
    if (!role) e.role = 'Please select your role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPw) e.confirmPw = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1400);
  };


  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, fontFamily: "'Roboto', sans-serif", padding: '24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '56px 40px', maxWidth: '440px', width: '100%', textAlign: 'center', border: `1px solid ${T.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #4CAF50, #388E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 6px 20px rgba(76,175,80,0.35)' }}>
            <CheckCircle size={36} color="#fff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: T.text, marginBottom: '12px' }}>Account Created!</h2>
          <p style={{ fontSize: '15px', color: T.sub, lineHeight: 1.65, marginBottom: '10px' }}>
            Welcome to BloodLink, <strong>{fullName.split(' ')[0]}</strong>! Your account has been set up.
          </p>
          <p style={{ fontSize: '13px', color: T.sub, marginBottom: '32px' }}>
            A confirmation email has been sent to <strong>{email}</strong>
          </p>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: T.red, color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(211,47,47,0.35)' }}>
            Go to Dashboard <ArrowRight size={16} />
          </button>
        </div>
        <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Roboto', sans-serif" }}>


      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width: '42%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, #004D40 0%, #00695C 55%, #00897B 100%)',
          padding: '44px',
        }}
      >

        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="14" r="1.5" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />


        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>BloodLink</span>
        </div>


        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '18px', letterSpacing: '-0.5px' }}>
            Join 120+ hospitals saving lives with BloodLink
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '36px' }}>
            Set up your blood bank in minutes and start tracking every unit in real time.
          </p>
          {[
            'Real-time blood inventory dashboard',
            'Automatic low-stock & expiry alerts',
            'Inter-hospital blood sharing network',
            'Role-based access for your team',
            'Barcode scanning support',
          ].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={13} color="#fff" />
              </div>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>


        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #009688, #00796B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>NO</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Dr. Ngozi Okafor</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>Lagos State Hospital</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;BloodLink cut our blood wastage by 40% in the first month alone.&rdquo;
          </div>
        </div>
      </div>


      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 24px', backgroundColor: T.bg, overflowY: 'auto' }}>
        <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}>


          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(211,47,47,0.4)' }}>
              <Droplets size={17} color="#fff" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: T.text }}>BloodLink</span>
          </div>


          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: T.text, letterSpacing: '-0.4px', marginBottom: '6px' }}>Create your account</h1>
            <p style={{ fontSize: '14px', color: T.sub }}>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: T.red, fontWeight: 600, cursor: 'pointer', fontSize: '14px', padding: 0 }}>
                Sign In
              </button>
            </p>
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: step >= 1 ? T.red : T.border, color: step >= 1 ? '#fff' : T.sub, fontSize: '12px', fontWeight: 700, transition: 'background-color 0.3s' }}>
                {step > 1 ? <CheckCircle size={14} color="#fff" /> : 1}
              </div>
              <span style={{ fontSize: '12px', fontWeight: step === 1 ? 600 : 400, color: step === 1 ? T.text : T.sub }}>Your info</span>
            </div>
            <div style={{ flex: 1, height: '2px', borderRadius: '1px', backgroundColor: step > 1 ? T.red : T.border, transition: 'background-color 0.3s' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: step >= 2 ? T.red : T.border, color: step >= 2 ? '#fff' : T.sub, fontSize: '12px', fontWeight: 700, transition: 'background-color 0.3s' }}>
                2
              </div>
              <span style={{ fontSize: '12px', fontWeight: step === 2 ? 600 : 400, color: step === 2 ? T.text : T.sub }}>Set password</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <InputField label="Full Name" icon={User} value={fullName} onChange={setFullName}
                placeholder="e.g. Dr. Ngozi Okafor" error={errors.fullName} />
              <InputField label="Email Address" icon={Mail} type="email" value={email} onChange={setEmail}
                placeholder="you@hospital.ng" error={errors.email} />
              <SelectField label="Hospital" icon={Building2} value={hospital} onChange={setHospital}
                options={hospitals} placeholder="Select your hospital" />
              {errors.hospital && <p style={{ fontSize: '11px', color: '#F44336', marginTop: '-10px', marginBottom: '12px' }}>{errors.hospital}</p>}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '10px' }}>Your Role</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {roles.map(r => (
                    <div key={r.value} onClick={() => setRole(r.value)} style={{
                      padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                      border: `1.5px solid ${role === r.value ? T.red : T.border}`,
                      backgroundColor: role === r.value ? T.redLight : '#fff',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: role === r.value ? T.red : T.text }}>{r.label}</span>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${role === r.value ? T.red : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {role === r.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: T.red }} />}
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', color: T.sub, marginTop: '3px' }}>{r.desc}</p>
                    </div>
                  ))}
                </div>
                {errors.role && <p style={{ fontSize: '11px', color: '#F44336', marginTop: '6px' }}>{errors.role}</p>}
              </div>

              <button
                type="button"
                onClick={handleNext}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: `linear-gradient(135deg, ${T.red}, ${T.redDark})`, color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(211,47,47,0.35)', transition: 'opacity 0.2s' }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>


            <div style={{ display: step === 2 ? 'block' : 'none' }}>
              <InputField
                label="Password" icon={Lock} type={showPw ? 'text' : 'password'}
                value={password} onChange={setPassword}
                placeholder="Min. 8 characters" error={errors.password}
                suffix={
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF', display: 'flex' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <PasswordStrength password={password} />

              <InputField
                label="Confirm Password" icon={Lock} type={showCpw ? 'text' : 'password'}
                value={confirmPw} onChange={setConfirmPw}
                placeholder="Repeat password" error={errors.confirmPw}
                suffix={
                  <button type="button" onClick={() => setShowCpw(!showCpw)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF', display: 'flex' }}>
                    {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />


              <div style={{ marginBottom: '24px' }}>
                <div
                  onClick={() => setAgreed(!agreed)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `2px solid ${agreed ? T.red : T.border}`, backgroundColor: agreed ? T.red : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'all 0.2s' }}>
                    {agreed && <CheckCircle size={11} color="#fff" />}
                  </div>
                  <span style={{ fontSize: '13px', color: T.sub, lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <span style={{ color: T.red, fontWeight: 600, cursor: 'pointer' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span style={{ color: T.red, fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
                  </span>
                </div>
                {errors.agreed && <p style={{ fontSize: '11px', color: '#F44336', marginTop: '6px' }}>{errors.agreed}</p>}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrors({}); }}
                  style={{ padding: '14px 20px', borderRadius: '12px', border: `1.5px solid ${T.border}`, backgroundColor: '#fff', color: T.text, fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#ccc' : `linear-gradient(135deg, ${T.red}, ${T.redDark})`, color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: loading ? 'none' : '0 4px 14px rgba(211,47,47,0.35)', transition: 'all 0.2s' }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Creating account…
                    </>
                  ) : (
                    <>Create Account <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: T.sub, marginTop: '28px' }}>
            By signing up you agree to our data processing policy under{' '}
            <span style={{ color: T.red, fontWeight: 600 }}>NDPR guidelines</span>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
