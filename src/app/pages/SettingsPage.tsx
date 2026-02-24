import React, { useState, useRef, useEffect } from 'react';
import { Bell, Wifi, Lock, User, ChevronRight, Moon, Globe, Smartphone, Shield, Database, HelpCircle, Hospital, Camera, Trash2 } from 'lucide-react';

const T = { primary: '#D32F2F', secondary: '#009688', text: '#111827', sub: '#6B7280', border: '#E5E7EB' };
const CARD: React.CSSProperties = { backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' };

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: on ? T.secondary : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '2px', left: on ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </div>
  );
}

function Row({ icon: Icon, label, sub, value, toggle, onToggle, onClick }: {
  icon: React.ElementType; label: string; sub?: string; value?: string;
  toggle?: boolean; onToggle?: () => void; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick || onToggle}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 20px', borderBottom: `1px solid ${T.border}`, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={T.secondary} />
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: T.text }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: T.sub, marginTop: '1px' }}>{sub}</div>}
      </div>
      {toggle !== undefined
        ? <Toggle on={toggle} onToggle={onToggle!} />
        : value
          ? <span style={{ fontSize: '12px', color: T.sub }}>{value}</span>
          : <ChevronRight size={15} color="#D1D5DB" />
      }
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', paddingLeft: '2px' }}>
        {label}
      </div>
      <div style={CARD}>{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const [notifs, setNotifs] = useState(true);
  const [dark, setDark] = useState(false);
  const [bio, setBio] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offline, setOffline] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(() => localStorage.getItem('bloodlink_profile_pic'));
  const [hovering, setHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePic(dataUrl);
      localStorage.setItem('bloodlink_profile_pic', dataUrl);
      window.dispatchEvent(new Event('profilePicUpdate'));
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  const handleRemovePic = () => {
    setProfilePic(null);
    localStorage.removeItem('bloodlink_profile_pic');
    window.dispatchEvent(new Event('profilePicUpdate'));
  };

  return (
    <div style={{ padding: '20px 24px 40px', maxWidth: '700px', margin: '0 auto', fontFamily: "'Roboto', sans-serif" }}>


      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />


      <div style={{ backgroundColor: '#fff', border: `1px solid ${T.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>


        <div
          style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => fileInputRef.current?.click()}
        >

          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', display: 'block', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', border: '2px solid #fff' }}
            />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #D32F2F, #B71C1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700, boxShadow: '0 4px 14px rgba(211,47,47,0.3)' }}>
              DA
            </div>
          )}


          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.48)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
            opacity: hovering ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}>
            <Camera size={16} color="#fff" />
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: 600, lineHeight: 1 }}>Upload</span>
          </div>


          {profilePic && (
            <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: T.text }}>Dr. Adeyemi</div>
          <div style={{ fontSize: '13px', color: T.sub, marginTop: '1px' }}>Blood Bank Officer · General Hospital Lagos</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#E8F5E9' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50' }} />
              <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 500 }}>Active Session</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#EDE7F6', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#7B1FA2', fontWeight: 500 }}
            >
              <Camera size={10} />
              {profilePic ? 'Change photo' : 'Upload photo'}
            </button>
            {profilePic && (
              <button
                onClick={handleRemovePic}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#FFEBEE', border: 'none', cursor: 'pointer', fontSize: '11px', color: T.primary, fontWeight: 500 }}
              >
                <Trash2 size={10} />
                Remove
              </button>
            )}
          </div>
        </div>

        <button style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: 'transparent', fontSize: '12px', color: T.sub, cursor: 'pointer', fontWeight: 500 }}>
          Edit Profile
        </button>
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Section label="Account">
          <Row icon={User} label="Profile" sub="Edit name, role, contact" />
          <Row icon={Lock} label="Change Password" sub="Last changed 30 days ago" />
          <Row icon={Shield} label="Biometric Login" toggle={bio} onToggle={() => setBio(!bio)} />
          <Row icon={Hospital} label="Hospital" value="General Hospital Lagos" />
        </Section>

        <Section label="Notifications">
          <Row icon={Bell} label="Push Notifications" sub="Alerts for expiry, low stock" toggle={notifs} onToggle={() => setNotifs(!notifs)} />
          <Row icon={Bell} label="Alert Thresholds" sub="Configure minimum stock levels" />
          <Row icon={Smartphone} label="SMS Alerts" sub="Critical alerts via SMS" toggle={false} onToggle={() => { }} />
        </Section>

        <Section label="System">
          <Row icon={Wifi} label="Auto Sync" sub="Sync inventory every 5 minutes" toggle={autoSync} onToggle={() => setAutoSync(!autoSync)} />
          <Row icon={Database} label="Offline Mode" sub="Cache data for offline use" toggle={offline} onToggle={() => setOffline(!offline)} />
          <Row icon={Moon} label="Dark Mode" toggle={dark} onToggle={() => setDark(!dark)} />
          <Row icon={Globe} label="Language" value="English" />
        </Section>

        <Section label="Support">
          <Row icon={HelpCircle} label="Help & Documentation" />
          <Row icon={Shield} label="Privacy Policy" />
        </Section>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#D1D5DB' }}>
        BloodLink v1.0.0 · General Hospital Lagos · NMSA Compliant
      </div>
    </div>
  );
}