import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  Droplets, Bell, Settings, LogOut, Menu, X, ChevronDown,
  LayoutDashboard, ClipboardList, PlusCircle, Share2, BarChart3, BrainCircuit,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', end: true },
  { path: '/inventory', label: 'Inventory' },
  { path: '/add-unit', label: 'Add Unit' },
  { path: '/sharing', label: 'Sharing' },
  { path: '/alerts', label: 'Alerts', badge: 4 },
  { path: '/forecast', label: 'AI Forecast' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Settings' },
];

const mobileNavItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
  { path: '/inventory', label: 'Inventory', icon: ClipboardList },
  { path: '/add-unit', label: 'Add', icon: PlusCircle },
  { path: '/forecast', label: 'AI', icon: BrainCircuit },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: 4 },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string | null>(() => localStorage.getItem('bloodlink_profile_pic'));

  // Sync profile pic across the app via custom event
  useEffect(() => {
    const handler = () => setProfilePic(localStorage.getItem('bloodlink_profile_pic'));
    window.addEventListener('profilePicUpdate', handler);
    return () => window.removeEventListener('profilePicUpdate', handler);
  }, []);

  const openDrawer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMobileOpen(true);
    // tiny rAF so the browser paints the element before the transition fires
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const closeDrawer = () => {
    setVisible(false);
    closeTimer.current = setTimeout(() => setMobileOpen(false), 320);
  };

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        height: '60px',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>


        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            backgroundColor: '#D32F2F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(211,47,47,0.4)',
          }}>
            <Droplets size={17} color="#fff" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827', letterSpacing: '-0.2px' }}>
            BloodLink
          </span>
        </div>


        <nav
          className="hidden lg:flex items-center gap-0.5 flex-1 justify-center"
          style={{ maxWidth: '680px', margin: '0 auto' }}
        >
          {navItems.map(({ path, label, badge, end }) => (
            <NavLink key={path} to={path} end={end} style={{ position: 'relative' }}>
              {({ isActive }) => (
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: isActive ? '#D32F2F' : 'transparent',
                  color: isActive ? '#fff' : '#6B7280',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.15s, color 0.15s',
                  position: 'relative',
                }}>
                  {label}
                  {badge && (
                    <span style={{
                      position: 'absolute', top: '-2px', right: '-2px',
                      width: '15px', height: '15px', borderRadius: '50%',
                      backgroundColor: '#FF9800', color: '#fff',
                      fontSize: '8px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>


        <div className="hidden lg:block flex-1" />


        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={openDrawer}
          >
            <Menu size={20} color="#374151" />
          </button>


          <NavLink
            to="/alerts"
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Bell size={19} color="#374151" />
            <span style={{
              position: 'absolute', top: '7px', right: '7px',
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: '#D32F2F',
              border: '1.5px solid #fff',
            }} />
          </NavLink>


          <NavLink to="/settings" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Settings size={19} color="#374151" />
          </NavLink>


          <div className="hidden sm:block" style={{ width: '1px', height: '28px', backgroundColor: '#E5E7EB', margin: '0 4px' }} />


          <div
            className="hidden sm:flex items-center gap-2 cursor-pointer px-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/settings')}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              flexShrink: 0, overflow: 'hidden',
              background: 'linear-gradient(135deg, #009688, #00796B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '11px', fontWeight: 700,
            }}>
              {profilePic
                ? <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : 'DA'
              }
            </div>
            <div className="hidden xl:block" style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Dr. Adeyemi</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Blood Bank Officer</div>
            </div>
            <ChevronDown size={13} color="#9CA3AF" className="hidden xl:block" />
          </div>


          <button
            onClick={() => navigate('/login')}
            className="hidden lg:flex p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <LogOut size={17} color="#9CA3AF" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <>
          {/* Backdrop — fades in/out */}
          <div
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: 'rgba(0,0,0,0.45)',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onClick={closeDrawer}
          />

          {/* Drawer panel — slides in from the left */}
          <div
            className="fixed inset-y-0 left-0 z-50 flex flex-col"
            style={{
              width: '270px',
              backgroundColor: '#fff',
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
              transform: visible ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform',
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid #E5E7EB',
            }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => {
                  navigate('/');
                  closeDrawer();
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  backgroundColor: '#D32F2F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(211,47,47,0.35)',
                }}>
                  <Droplets size={15} color="#fff" />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>BloodLink</span>
              </div>
              <button
                onClick={closeDrawer}
                style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget.style.backgroundColor = '#E5E7EB'); (e.currentTarget.style.transform = 'rotate(90deg)'); }}
                onMouseLeave={e => { (e.currentTarget.style.backgroundColor = '#F3F4F6'); (e.currentTarget.style.transform = 'rotate(0deg)'); }}
              >
                <X size={16} color="#374151" />
              </button>
            </div>

            <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
              {navItems.map(({ path, label, badge, end }, idx) => (
                <NavLink key={path} to={path} end={end} onClick={closeDrawer}>
                  {({ isActive }) => (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#FFEBEE' : 'transparent',
                        color: isActive ? '#D32F2F' : '#374151',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '14px',
                        marginBottom: '3px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
                        transition: `opacity 0.28s ease ${0.06 + idx * 0.045}s, transform 0.28s ease ${0.06 + idx * 0.045}s`,
                      }}
                    >
                      {label}
                      {badge && (
                        <span style={{
                          padding: '1px 7px', borderRadius: '10px',
                          backgroundColor: '#FF9800', color: '#fff',
                          fontSize: '10px', fontWeight: 700,
                        }}>
                          {badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User footer — slides up */}
            <div
              style={{
                padding: '14px 16px', borderTop: '1px solid #E5E7EB',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.3s ease 0.38s, transform 0.3s ease 0.38s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #009688, #00796B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '13px', fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0,150,136,0.3)',
                }}>
                  DA
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Dr. Adeyemi</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Blood Bank Officer</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '9px', borderRadius: '10px',
                  border: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px',
                  backgroundColor: 'transparent', cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>

      <nav
        className="flex md:hidden items-center"
        style={{
          position: 'sticky', bottom: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #E5E7EB',
          padding: '4px 0',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
          zIndex: 40,
        }}
      >
        {mobileNavItems.map(({ path, label, icon: Icon, badge, end }) => (
          <NavLink
            key={path} to={path} end={end}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  width: '36px', height: '28px', borderRadius: '10px',
                  backgroundColor: isActive ? '#FFEBEE' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Icon size={18} color={isActive ? '#D32F2F' : '#9CA3AF'} />
                  {badge && (
                    <span style={{
                      position: 'absolute', top: '1px', right: '1px',
                      width: '13px', height: '13px', borderRadius: '50%',
                      backgroundColor: '#FF9800', color: '#fff',
                      fontSize: '8px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: isActive ? '#D32F2F' : '#9CA3AF', fontWeight: isActive ? 600 : 400, marginTop: '1px' }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}