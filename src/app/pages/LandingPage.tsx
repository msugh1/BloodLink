import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Droplets, Shield, Zap, Users, BarChart3, Share2,
  ArrowRight, CheckCircle, ChevronDown, Menu, X,
  Clock, Bell, TrendingUp, HeartPulse, Star,
} from 'lucide-react';

const T = {
  red: '#D32F2F', redDark: '#B71C1C', redLight: '#FFEBEE',
  teal: '#009688', tealDark: '#00796B',
  orange: '#FF9800', green: '#4CAF50',
  text: '#111827', sub: '#6B7280', border: '#E5E7EB',
  bg: '#F8FAFC',
};

/* ── Small animated counter ─────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        setCount(Math.floor(p * p * to));
        if (p < 1) requestAnimationFrame(tick);
        else setCount(to);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Fade-in on scroll ───────────────────────────────────── */
function FadeIn({ children, delay = 0, direction = 'up' }: {
  children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); observer.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const translate = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', none: 'none' };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : translate[direction],
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const features = [
  { icon: BarChart3, color: T.red, title: 'Real-time Inventory', desc: 'Live blood unit tracking with expiry alerts, blood type filters, and instant availability status across all wards.' },
  { icon: Share2, color: T.teal, title: 'Inter-Hospital Sharing', desc: 'Request and fulfil blood transfers between partner hospitals in minutes — reducing waste and saving more lives.' },
  { icon: Bell, color: T.orange, title: 'Smart Alerts', desc: 'Automated low-stock, expiring-soon, and critical shortage notifications sent to the right staff instantly.' },
  { icon: Shield, color: '#7C3AED', title: 'Role-Based Access', desc: 'Blood Bank Officers, Doctors, and Admins each see exactly what they need — with full audit trails.' },
  { icon: TrendingUp, color: T.green, title: 'Reports & Analytics', desc: 'Monthly consumption trends, wastage rates, and demand forecasts powered by your own hospital data.' },
  { icon: Zap, color: '#F59E0B', title: 'Barcode Scanning', desc: 'Scan blood bag barcodes to add, track, or dispense units in seconds — no manual typing required.' },
];

const steps = [
  { n: '01', title: 'Register your hospital', desc: 'Sign up, set up your blood bank profile, and invite your team members with role assignments.' },
  { n: '02', title: 'Add blood inventory', desc: 'Scan or manually add blood units with type, volume, collection date, and expiry.' },
  { n: '03', title: 'Monitor & respond', desc: 'Watch your dashboard for alerts, manage requests, and share units across hospitals effortlessly.' },
];

const testimonials = [
  { name: 'Dr. Ngozi Okafor', role: 'Chief Medical Officer, Lagos State Hospital', avatar: 'NO', color: '#009688', quote: 'BloodLink cut our blood wastage by 40% in the first month. The expiry alerts alone saved us thousands of units.' },
  { name: 'Adeyemi Bello', role: 'Blood Bank Officer, LUTH', avatar: 'AB', color: '#D32F2F', quote: 'The inter-hospital sharing feature is a game changer. We fulfilled an emergency O- request in under 8 minutes.' },
  { name: 'Dr. Emeka Chukwu', role: 'Medical Director, UCH Ibadan', avatar: 'EC', color: '#7C3AED', quote: 'Our staff love how simple it is. The role-based dashboards mean everyone sees exactly what they need.' },
];

const stats = [
  { value: 120, suffix: '+', label: 'Hospitals onboarded' },
  { value: 98, suffix: 'k+', label: 'Blood units tracked' },
  { value: 40, suffix: '%', label: 'Wastage reduction' },
  { value: 8, suffix: 'min', label: 'Avg. transfer time' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setNavOpen(false); };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#fff', color: T.text }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid',
        borderBottomColor: scrolled ? T.border : 'transparent',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.07)' : '0 0 0 rgba(0,0,0,0)',
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: scrolled ? '#D32F2F' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: scrolled ? '0 3px 8px rgba(211,47,47,0.4)' : 'none', transition: 'background-color 0.3s ease, box-shadow 0.3s ease' }}>
            <Droplets size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: scrolled ? T.text : '#fff', letterSpacing: '-0.3px' }}>BloodLink</span>
        </div>


        <nav className="hidden md:flex items-center gap-7">
          {['features', 'how-it-works', 'testimonials'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
              color: scrolled ? T.sub : 'rgba(255,255,255,0.85)',
              fontWeight: 500, textTransform: 'capitalize',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = scrolled ? T.text : '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? T.sub : 'rgba(255,255,255,0.85)')}
            >
              {id.replace(/-/g, ' ')}
            </button>
          ))}
        </nav>


        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/login')} style={{
            padding: '8px 20px', borderRadius: '22px', fontSize: '13px', fontWeight: 600,
            border: '1.5px solid',
            borderColor: scrolled ? T.border : 'rgba(255,255,255,0.5)',
            backgroundColor: 'transparent',
            color: scrolled ? T.text : '#fff',
            cursor: 'pointer', transition: 'background-color 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = scrolled ? T.bg : 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} style={{
            padding: '8px 22px', borderRadius: '22px', fontSize: '13px', fontWeight: 700,
            backgroundColor: scrolled ? T.red : '#fff',
            color: scrolled ? '#fff' : T.red,
            border: 'none', cursor: 'pointer',
            boxShadow: scrolled ? '0 3px 10px rgba(211,47,47,0.35)' : '0 0 0 rgba(0,0,0,0)',
            transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s',
          }}>
            Get Started Free
          </button>
        </div>


        <button className="md:hidden p-2 rounded-lg" onClick={() => setNavOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {navOpen ? <X size={22} color={scrolled ? T.text : '#fff'} /> : <Menu size={22} color={scrolled ? T.text : '#fff'} />}
        </button>
      </header>


      {navOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
          backgroundColor: '#fff', borderBottom: `1px solid ${T.border}`,
          padding: '12px 20px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.25s ease',
        }}>
          {['features', 'how-it-works', 'testimonials'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '12px 4px',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px',
              color: T.sub, fontWeight: 500, textTransform: 'capitalize',
              borderBottom: `1px solid ${T.border}`,
            }}>
              {id.replace(/-/g, ' ')}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={() => navigate('/login')} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: `1px solid ${T.border}`, background: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
            <button onClick={() => navigate('/signup')} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: T.red, color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Get Started</button>
          </div>
        </div>
      )}

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, #C62828 0%, #B71C1C 50%, #7B1111 100%)`,
        display: 'flex', alignItems: 'center',
      }}>

        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>


        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />

        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative', width: '100%' }}>
          <div className="flex flex-col lg:flex-row items-center gap-12">


            <div className="flex-1 text-center lg:text-left">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                borderRadius: '20px', padding: '6px 16px', marginBottom: '28px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <HeartPulse size={14} color="#fff" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', letterSpacing: '0.5px' }}>
                  BUILT FOR NIGERIAN HOSPITALS
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 900,
                color: '#fff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '22px',
              }}>
                Every Drop Counts.<br />
                <span style={{ color: '#FFCDD2' }}>Never Lose a Unit.</span>
              </h1>

              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '38px', maxWidth: '540px' }}>
                BloodLink is the all-in-one blood bank management system designed for hospitals real time inventory, smart alerts, and seamless inter-hospital sharing.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }} className="lg:justify-start">
                <button onClick={() => navigate('/signup')} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 30px', borderRadius: '30px', border: 'none',
                  backgroundColor: '#fff', color: T.red,
                  fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'; }}
                >
                  Get Started Free <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/login')} style={{
                  padding: '14px 30px', borderRadius: '30px',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  backgroundColor: 'transparent', color: '#fff',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Sign In
                </button>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '44px', flexWrap: 'wrap', justifyContent: 'center' }} className="lg:justify-start">
                {[['120+', 'Hospitals'], ['98k+', 'Units tracked'], ['40%', 'Less wastage']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{v}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>


            <div className="hidden lg:block flex-1" style={{ maxWidth: '440px' }}>
              <div style={{
                backgroundColor: '#fff', borderRadius: '16px',
                padding: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                transform: 'rotate(1.5deg)',
                transition: 'transform 0.3s',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.01)')}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = 'rotate(1.5deg)')}
              >

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: T.sub, fontWeight: 500 }}>BLOOD INVENTORY</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: T.text }}>Lagos General Hospital</div>
                  </div>
                  <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: T.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Droplets size={17} color={T.red} />
                  </div>
                </div>


                {[
                  { type: 'A+', units: 24, max: 40, color: T.green },
                  { type: 'O-', units: 3, max: 40, color: '#F44336' },
                  { type: 'B+', units: 17, max: 40, color: T.teal },
                  { type: 'AB+', units: 8, max: 40, color: T.orange },
                ].map(({ type, units, max, color }) => (
                  <div key={type} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{type}</span>
                      <span style={{ fontSize: '12px', color: T.sub }}>{units} units</span>
                    </div>
                    <div style={{ height: '7px', borderRadius: '4px', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(units / max) * 100}%`, borderRadius: '4px', backgroundColor: color, transition: 'width 1.2s ease' }} />
                    </div>
                  </div>
                ))}


                <div style={{
                  marginTop: '18px', padding: '10px 14px', borderRadius: '10px',
                  backgroundColor: '#FFF3E0', border: '1px solid #FFE0B2',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Bell size={14} color={T.orange} />
                  <span style={{ fontSize: '12px', color: '#E65100', fontWeight: 600 }}>
                    O- critically low — 3 units remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <button onClick={() => scrollTo('features')} style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          animation: 'bounce 2s infinite',
          color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.5px' }}>SCROLL</span>
          <ChevronDown size={20} color="rgba(255,255,255,0.7)" />
        </button>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: T.text, padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
          {stats.map(({ value, suffix, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                <Counter to={value} suffix={suffix} />
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '6px', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '96px 24px', backgroundColor: T.bg }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: T.red, letterSpacing: '1.5px' }}>FEATURES</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: '8px', letterSpacing: '-0.5px' }}>
                Everything your blood bank needs
              </h2>
              <p style={{ fontSize: '16px', color: T.sub, marginTop: '14px', maxWidth: '540px', margin: '14px auto 0' }}>
                Purpose-built for Nigerian hospital workflows, BloodLink handles the complexity so your team can focus on saving lives.
              </p>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.09} direction={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'up'}>
                <div style={{
                  backgroundColor: '#fff', borderRadius: '14px', padding: '28px',
                  border: `1px solid ${T.border}`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.09)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: T.text, marginBottom: '8px' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: T.sub, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '96px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: T.teal, letterSpacing: '1.5px' }}>HOW IT WORKS</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: '8px', letterSpacing: '-0.5px' }}>
                Up and running in minutes
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {steps.map(({ n, title, desc }, i) => (
              <FadeIn key={n} delay={i * 0.13}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${T.red}, ${T.redDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 6px 16px rgba(211,47,47,0.3)',
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{n}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: T.text, marginBottom: '10px' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: T.sub, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section id="testimonials" style={{ padding: '96px 24px', backgroundColor: T.bg }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', letterSpacing: '1.5px' }}>TESTIMONIALS</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: '8px', letterSpacing: '-0.5px' }}>
                Trusted by Nigerian medical staff
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            {testimonials.map(({ name, role, avatar, color, quote }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div style={{
                  backgroundColor: '#fff', borderRadius: '14px', padding: '28px',
                  border: `1px solid ${T.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}>

                  <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                    {[...Array(5)].map((_, si) => <Star key={si} size={14} color="#FFC107" fill="#FFC107" />)}
                  </div>
                  <p style={{ fontSize: '14px', color: T.sub, lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>"{quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                      {avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>{name}</div>
                      <div style={{ fontSize: '11px', color: T.sub }}>{role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section style={{
        padding: '96px 24px',
        background: `linear-gradient(135deg, #C62828, #B71C1C 60%, #7B1111)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '5%', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <FadeIn>
          <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px' }}>
              Ready to transform your blood bank?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '38px' }}>
              Join over 120 Nigerian hospitals already using BloodLink to save lives every day.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '15px 34px', borderRadius: '30px', border: 'none',
                backgroundColor: '#fff', color: T.red,
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'; }}
              >
                Create Free Account <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/login')} style={{
                padding: '15px 34px', borderRadius: '30px',
                border: '1.5px solid rgba(255,255,255,0.45)', backgroundColor: 'transparent',
                color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Sign In Instead
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: '#0F172A', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={15} color="#fff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>BloodLink</span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            © 2026 BloodLink. Built for Nigerian hospitals. Every drop counts.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}